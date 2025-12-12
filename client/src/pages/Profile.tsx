import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Calendar, MapPin, Store, Trophy } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

export default function Profile() {
  const { user, logout } = useAuth();
  const { data: stats } = trpc.checkins.myStats.useQuery();
  const { data: checkins } = trpc.checkins.myCheckins.useQuery();

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      window.location.href = "/";
    },
  });

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
  };

  if (!user) {
    return null;
  }

  const getBadgeLevel = (visitedCount: number) => {
    if (visitedCount >= 23) return { level: "コンプリート", color: "text-yellow-600 bg-yellow-50" };
    if (visitedCount >= 15) return { level: "マスター", color: "text-purple-600 bg-purple-50" };
    if (visitedCount >= 10) return { level: "エキスパート", color: "text-blue-600 bg-blue-50" };
    if (visitedCount >= 5) return { level: "アドベンチャー", color: "text-green-600 bg-green-50" };
    return { level: "ビギナー", color: "text-gray-600 bg-gray-50" };
  };

  const badge = stats ? getBadgeLevel(stats.visitedCount) : null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Store className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold">マイページ</h1>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              ログアウト
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="container max-w-2xl space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-xl">
                    {user.name?.charAt(0) ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-2xl">{user.name ?? "ユーザー"}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          {stats && badge && (
            <Card className={`${badge.color} border-2`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-6 w-6" />
                      {badge.level}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {stats.visitedCount} / {stats.totalStores} 店舗訪問済み
                    </CardDescription>
                  </div>
                  <div className="text-4xl font-bold">{stats.percentage}%</div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="w-full bg-white/50 rounded-full h-4">
                  <div
                    className="bg-current h-4 rounded-full transition-all"
                    style={{ width: `${stats.percentage}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          )}

          <div>
            <h2 className="text-2xl font-bold mb-4">訪問履歴</h2>
            {checkins && checkins.length > 0 ? (
              <div className="space-y-4">
                {checkins.map((item) => (
                  <Card key={item.checkin.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">
                            {item.store?.storeName ?? "Unknown Store"}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {item.store?.brand} - {item.store?.state}, {item.store?.country}
                          </CardDescription>
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(item.checkin.createdAt), "yyyy/MM/dd", { locale: ja })}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {item.checkin.photoUrl && (
                        <img
                          src={item.checkin.photoUrl}
                          alt="Check-in photo"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      )}
                      {item.checkin.comment && (
                        <p className="text-sm">{item.checkin.comment}</p>
                      )}
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {item.store?.address}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Store className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">まだチェックインしていません</p>
                  <Link href="/">
                    <Button className="mt-4">店舗を探す</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
