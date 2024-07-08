"use client";
import { useSearchParams } from "next/navigation";
import QRCode from "qrcode";
import { useEffect, useState } from "react";

interface HomePageProps {
  userAgent: string;
}

const HomePage = ({ userAgent }: HomePageProps) => {
  const searchParams = useSearchParams();
  const iosStoreLink =
    "https://apps.apple.com/us/app/t%C3%BAc-t%E1%BA%AFc-tea/id6476489604";
  const androidStoreLink =
    "https://play.google.com/store/apps/details?id=com.idsvn.tuctacteaapp&referrer=utm_source%3Dgoogle%26utm_medium%3Demail%26utm_campaign%3Dsummer_sale%26affiliateId%3D12345";
  const deepLinkBase = "tuctacteaapp://home";
  const [srcQRCode, setSrcQRCode] = useState<string>("");

  useEffect(() => {
    redirectToApp();
    generateQRCode();
  }, [searchParams, userAgent]);

  const redirectToApp = () => {
    let deepLink = deepLinkBase;
    const params = new URLSearchParams(searchParams.toString());

    if (/iPad|iPhone|iPod/.test(userAgent) && !isMSStreamAvailable()) {
      params.append("platform", "ios");
      deepLink += `?${params.toString()}`;
      openApp(deepLink, iosStoreLink);
    } else if (/android/i.test(userAgent)) {
      params.append("platform", "android");
      deepLink += `?${params.toString()}`;
      openApp(deepLink, androidStoreLink);
    } else {
      showNonMobileContent();
    }
  };

  const openApp = (deepLink: string, storeLink: string) => {
    let now = new Date().getTime();
    let timeout = 5000; // Time to wait before redirecting to store
    setTimeout(function () {
      if (new Date().getTime() - now < timeout + 100) {
        window.location = storeLink as Location | (string & Location);
      }
    }, timeout);

    window.location = deepLink as Location | (string & Location);
  };

  const generateQRCode = async () => {
    try {
      const url = window.location.href;
      const qrCodeSrc = await QRCode.toDataURL(url);
      setSrcQRCode(qrCodeSrc);
    } catch (error) {
      console.error("Error generating QR Code:", error);
    }
  };

  const isMSStreamAvailable = (): boolean => {
    return typeof window !== "undefined" && "MSStream" in window;
  };

  const showNonMobileContent = () => {
    document.getElementById("non-mobile-content")!.style.display = "block";
  };

  return (
    <>
      <div id="non-mobile-content" className="hidden">
        <div className="container text-center mt-12">
          <div className="intro mb-6">
            <h2 className="text-2xl font-bold">
              Chào mừng bạn đến với ứng dụng Túc Tắc Tea!
            </h2>
            <p>Ứng dụng giúp bạn tận hưởng những ly trà đặc biệt từ Túc Tắc.</p>
          </div>
          <a
            className="btn inline-block px-4 py-2 m-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            href={iosStoreLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            App Store
          </a>
          <a
            className="btn inline-block px-4 py-2 m-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            href={androidStoreLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Play
          </a>
          <div className="qr-code mt-4 flex justify-center space-x-4">
            <img
              width="200"
              height="200"
              src={srcQRCode}
              alt="QR Code For Android"
            />
            <img
              width="200"
              height="200"
              src={srcQRCode}
              alt="QR Code For IOS"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
