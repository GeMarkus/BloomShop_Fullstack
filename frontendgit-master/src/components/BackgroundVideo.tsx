const BackgroundVideo: React.FC = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden">

    {/* 🌞 LIGHT MODE VIDEO */}
    <video
      className="absolute top-1/2 left-1/2 
        w-[177.78vh] h-[100vh] 
        min-w-[100vw] min-h-[56.25vw] 
        transform -translate-x-1/2 -translate-y-1/2 
        object-cover
        block dark:hidden"
      autoPlay
      muted
      loop
      playsInline
    >
      <source src="/File/lightBG.mp4" type="video/mp4" />
    </video>

    {/* 🌙 DARK MODE VIDEO */}
    <video
    className="absolute top-1/2 left-1/2 
      w-[177.78vh] h-[100vh] 
      min-w-[100vw] min-h-[56.25vw] 
      transform -translate-x-1/2 -translate-y-1/2 
      object-cover
      blur-md
      hidden dark:block"
    autoPlay
    muted
    loop
    playsInline
  >
    <source src="/File/DarkMode.mp4" type="video/mp4" />
  </video>

  </div>
);

export default BackgroundVideo;