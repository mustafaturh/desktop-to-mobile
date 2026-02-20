import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, CheckCircle, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Smartphone className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Uygulamayı Yükle</CardTitle>
          <CardDescription>
            Uygulamayı telefonunuza yükleyerek daha hızlı erişim sağlayın
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isInstalled ? (
            <div className="flex flex-col items-center gap-3 text-center">
              <CheckCircle className="h-12 w-12 text-primary" />
              <p className="text-lg font-medium">Uygulama zaten yüklü!</p>
              <p className="text-sm text-muted-foreground">
                Ana ekranınızdan uygulamayı açabilirsiniz.
              </p>
            </div>
          ) : deferredPrompt ? (
            <Button onClick={handleInstall} className="w-full" size="lg">
              <Download className="mr-2 h-5 w-5" />
              Uygulamayı Yükle
            </Button>
          ) : (
            <div className="space-y-3 text-center">
              <p className="text-sm text-muted-foreground">
                <strong>iPhone:</strong> Safari'de Paylaş → "Ana Ekrana Ekle"
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Android:</strong> Tarayıcı menüsü → "Ana ekrana ekle"
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Install;
