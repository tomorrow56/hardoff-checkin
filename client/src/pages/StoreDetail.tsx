import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Camera, CheckCircle, MapPin, Store } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link, useParams, useLocation } from "wouter";
import { toast } from "sonner";

export default function StoreDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const storeId = parseInt(id ?? "0");

  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [comment, setComment] = useState("");
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: store, isLoading } = trpc.stores.getById.useQuery({ id: storeId });
  const { data: hasVisited } = trpc.checkins.hasVisited.useQuery(
    { storeId },
    { enabled: isAuthenticated }
  );
  const utils = trpc.useUtils();
  const createCheckin = trpc.checkins.create.useMutation({
    onSuccess: () => {
      toast.success("チェックインしました！");
      utils.checkins.myStats.invalidate();
      utils.checkins.myCheckins.invalidate();
      utils.checkins.hasVisited.invalidate();
      navigate("/profile");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("位置情報の取得に失敗しました");
        }
      );
    }
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("写真のサイズは5MB以下にしてください");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCheckin = async () => {
    if (!userLocation) {
      toast.error("位置情報を取得中です。しばらくお待ちください");
      return;
    }

    setIsSubmitting(true);
    try {
      await createCheckin.mutateAsync({
        storeId,
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        comment: comment.trim() || undefined,
        photoBase64: photoBase64 || undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>店舗が見つかりません</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button>ホームに戻る</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Store className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">店舗詳細</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="container max-w-2xl space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{store.storeName}</CardTitle>
                  <CardDescription className="text-base mt-2">
                    {store.brand}
                  </CardDescription>
                </div>
                {hasVisited && (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">訪問済み</span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">{store.state}, {store.country}</p>
                  <p className="text-sm text-muted-foreground">{store.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {isAuthenticated && !hasVisited && (
            <Card>
              <CardHeader>
                <CardTitle>チェックイン</CardTitle>
                <CardDescription>
                  店舗から500m以内でチェックインできます
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">写真（任意）</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                  {photoBase64 ? (
                    <div className="relative">
                      <img
                        src={photoBase64}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => setPhotoBase64(null)}
                      >
                        削除
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full h-32"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="h-6 w-6 mr-2" />
                      写真を追加
                    </Button>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">コメント（任意）</label>
                  <Textarea
                    placeholder="訪問の感想を書いてみましょう..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleCheckin}
                  disabled={!userLocation || isSubmitting}
                >
                  {isSubmitting ? "チェックイン中..." : "チェックインする"}
                </Button>

                {!userLocation && (
                  <p className="text-sm text-muted-foreground text-center">
                    位置情報を取得中...
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {isAuthenticated && hasVisited && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6 text-center">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
                <p className="font-medium text-green-900">この店舗は訪問済みです</p>
                <p className="text-sm text-green-700 mt-1">
                  マイページで訪問記録を確認できます
                </p>
                <Link href="/profile">
                  <Button variant="outline" className="mt-4">
                    マイページを見る
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
