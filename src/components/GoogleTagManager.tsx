import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

interface GoogleTagManagerProps {
  gtmId: string;
}

const GoogleTagManager: React.FC<GoogleTagManagerProps> = ({ gtmId }) => {
  useEffect(() => {
    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    
    // Push GTM start event
    window.dataLayer.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js'
    });
  }, []);

  return (
    <>
      <Helmet>
        {/* Google Tag Manager */}
        <script>
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `}
        </script>
      </Helmet>
      
      {/* Google Tag Manager (noscript) */}
      <noscript>
        <iframe 
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0" 
          width="0" 
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    </>
  );
};

export default GoogleTagManager;
