import * as RadixSlider from "@radix-ui/react-slider";

interface Props {
  value?: number;
  onChange?: (value: number) => void;
  bgColor: string;
  max: number;
  step: number;
}

const Slider = ({ onChange, value = 1, bgColor, max, step }: Props) => {
  const handleChange = (newValue: number[]) => {
    onChange?.(newValue[0]);
  };
  return (
    <RadixSlider.Root
      className="relative flex items-center select-none touch-none w-full h-10"
      defaultValue={[1]}
      value={[value]}
      onValueChange={handleChange}
      max={max}
      step={step}
      aria-label="Volume"
    >
      <RadixSlider.Track className="bg-neutral-600 relative grow rounded-full h-[3px] cursor-pointer">
        <RadixSlider.Range
          className={`absolute ${bgColor} rounded-full h-full`}
        />
      </RadixSlider.Track>
    </RadixSlider.Root>
  );
};

export default Slider;
