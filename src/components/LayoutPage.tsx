import heroImage from "../assets/images/hero-image.jpg";
import heroImageSmall from "../assets/images/hero-image-sm.jpg";
import logoIcon from "../assets/icons/Logo.svg";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

interface LayoutPageProps extends ComponentProps<"div"> {}

export function LayoutPage({ children, className, ...rest }: LayoutPageProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-60 w-full">
        <div className="absolute h-full w-full object-cover">
          <picture>
            <source media="(max-width: 720px)" srcSet={heroImageSmall} />
            <img className="w-full h-full object-cover" src={heroImage} alt="World background" />
          </picture>
        </div>
        <img
          className="relative top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%]"
          src={logoIcon}
          alt="Logo image"
        />
      </div>
      <div
        className={twMerge(
          "flex flex-col gap-6 relative bg-eerie-black -mt-14 mb-4 inset-shadow-custom rounded-2xl md:mb-8",
          className
        )}
        {...rest}
      >
        {children}
      </div>
    </div>
  );
}
