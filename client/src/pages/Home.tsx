import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { MapPin, Store, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "wouter";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const { data: stores } = trpc.stores.list.useQuery();
  const { data: nearbyStores } = trpc.stores.nearby.useQuery(
    {
      latitude: userLocation?.latitude ?? 0,
      longitude: userLocation?.longitude ?? 0,
      radiusKm: 50,
    },
    { enabled: !!userLocation }
  );
  const { data: stats } = trpc.checkins.myStats.useQuery(undefined, { enabled: isAuthenticated });

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationError(null);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError("位置情報の取得に失敗しました");
        }
      );
    } else {
      setLocationError("お使いのブラウザは位置情報に対応していません");
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b bg-card">
          <div className="container py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Store className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold">HardOff めぐり</h1>
              </div>
              <Button asChild>
                <a href={getLoginUrl()}>ログイン</a>
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full text-center space-y-8">
            <div className="space-y-4">
              <Store className="h-20 w-20 text-primary mx-auto" />
              <h2 className="text-4xl font-bold">海外のハードオフを巡ろう</h2>
              <p className="text-xl text-muted-foreground">
                世界中のハードオフ店舗を訪問してチェックイン。あなたの訪問記録を残そう！
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 text-left">
              <Card>
                <CardHeader>
                  <MapPin className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>GPS チェックイン</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    店舗付近でGPS位置情報を使ってチェックイン
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Store className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>23店舗</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    アメリカ、タイ、台湾、カンボジアの海外店舗
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <TrendingUp className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>訪問記録</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    写真とコメントで思い出を残そう
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            <Button size="lg" asChild className="text-lg px-8 py-6">
              <a href={getLoginUrl()}>今すぐ始める</a>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const displayStores = nearbyStores && nearbyStores.length > 0 ? nearbyStores : stores ?? [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Store className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">HardOff めぐり</h1>
            </div>
            <Link href="/profile">
              <Button variant="outline">マイページ</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 pb-20">
        <div className="container max-w-4xl space-y-6">
          {stats && (
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
              <CardHeader>
                <CardTitle>あなたの訪問記録</CardTitle>
                <CardDescription>
                  {stats.visitedCount} / {stats.totalStores} 店舗訪問済み ({stats.percentage}%)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full bg-secondary rounded-full h-4">
                  <div
                    className="bg-primary h-4 rounded-full transition-all"
                    style={{ width: `${stats.percentage}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          )}

          {locationError && (
            <Card className="border-destructive">
              <CardContent className="pt-6">
                <p className="text-destructive text-sm">{locationError}</p>
              </CardContent>
            </Card>
          )}

          {userLocation && nearbyStores && nearbyStores.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="h-6 w-6 text-primary" />
                最寄りの店舗
              </h2>
            </div>
          )}

          <div className="space-y-4">
            {displayStores.map((store) => (
              <Link key={store.id} href={`/store/${store.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{store.storeName}</CardTitle>
                        <CardDescription className="mt-1">
                          {store.brand} - {store.state}, {store.country}
                        </CardDescription>
                      </div>
                      {"distance" in store && typeof store.distance === "number" && (
                        <div className="text-sm text-muted-foreground whitespace-nowrap ml-4">
                          {store.distance.toFixed(1)} km
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{store.address}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
