// analytics.js
(function(){
    // Cargar la librería de Google Analytics
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-GEY87YMG89';
    document.head.appendChild(script);
  
    // Configuración de Google Analytics
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-GEY87YMG89');
  })();
  