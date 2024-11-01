import * as RadixSlider from "@radix-ui/react-slider";
import { twMerge } from "tailwind-merge";

interface Props {
  value?: number;
  onChange?: (value: number) => void;
  bgColor: string;
  max: number;
  step: number;
  label: string;
}

const Slider = ({ onChange, value = 1, bgColor, max, step, label }: Props) => {
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
      aria-label={label}
    >
      <RadixSlider.Track className="bg-neutral-600 relative grow rounded-full h-[3px] cursor-pointer">
        <RadixSlider.Range
          className={twMerge("absolute rounded-full h-full", bgColor)}
        />
      </RadixSlider.Track>
    </RadixSlider.Root>
  );
};

export default Slider;
