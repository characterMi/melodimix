const Spinner = () => {
  const blades = Array.from({ length: 12 });

  return (
    <div className="w-[20px] h-[20px] relative inline-block">
      {blades.map((_, i) => (
        <div
          key={i}
          aria-hidden
          className="absolute left-[8px] bottom-0 w-[2px] h-[6px] rounded-[1px] bg-neutral-100 animate-spinner"
          style={{
            transform: `rotate(${i * 30}deg)`,
            transformOrigin: "center -4px",
            animationDelay: `${(i * 1) / 12}s`,
          }}
        />
      ))}
    </div>
  );
};

export default Spinner;
