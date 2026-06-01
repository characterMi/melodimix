import dynamic from "next/dynamic";
import { IoMdClose } from "react-icons/io";

const Root = dynamic(() =>
  import("@radix-ui/react-dialog").then((mod) => mod.Root)
);
const Portal = dynamic(() =>
  import("@radix-ui/react-dialog").then((mod) => mod.Portal)
);
const Overlay = dynamic(() =>
  import("@radix-ui/react-dialog").then((mod) => mod.Overlay)
);
const Content = dynamic(() =>
  import("@radix-ui/react-dialog").then((mod) => mod.Content)
);
const Title = dynamic(() =>
  import("@radix-ui/react-dialog").then((mod) => mod.Title)
);
const Description = dynamic(() =>
  import("@radix-ui/react-dialog").then((mod) => mod.Description)
);
const Close = dynamic(() =>
  import("@radix-ui/react-dialog").then((mod) => mod.Close)
);

interface Props {
  isOpen: boolean;
  handleChange: (open: boolean) => void;
  title: string;
  description: string;
  children: React.ReactNode;
  containerClassName?: string;
}

const Modal = ({
  children,
  description,
  isOpen,
  handleChange,
  title,
  containerClassName,
}: Props) => {
  return (
    <Root open={isOpen} defaultOpen={isOpen} onOpenChange={handleChange}>
      <Portal>
        <Overlay className="bg-neutral-900/90 backdrop-blur-sm fixed inset-0 z-[100] hidden md:block" />

        <Content className="fixed md:shadow-2xl border border-neutral-700 top-1/2 left-1/2 max-h-full h-full md:h-auto md:max-h-[85vh] w-full md:w-[90vw] md:max-w-[450px] -translate-x-1/2 -translate-y-1/2 md:rounded-md bg-neutral-800 p-[25px] focus:outline-none z-[100] overflow-y-auto flex flex-col">
          <Title className="text-xl text-center font-bold mb-4">{title}</Title>

          <Description className="mb-5 text-sm leading-normal text-center">
            {description}
          </Description>

          <div className={containerClassName}>{children}</div>

          <Close asChild>
            <button
              className="text-neutral-400 hover:text-white absolute top-[10px] inline-flex h-[25px] w-[25px] right-[10px] items-center justify-center appearance-none rounded-full"
              aria-label="Close"
            >
              <IoMdClose aria-hidden />
            </button>
          </Close>
        </Content>
      </Portal>
    </Root>
  );
};
export default Modal;
