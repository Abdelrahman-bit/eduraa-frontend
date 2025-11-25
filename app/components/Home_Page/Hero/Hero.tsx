import React from "react";
import Button from "../../Button/Button";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="min-h-[70vh] bg-gray-scale-50 flex ">
      <div className="w-[90%] ml-auto flex gap-8 items-center justify-between ">
        {/* text  */}
        <div className="flex flex-col gap-8 items-start">
          <h1 className="text-6xl font-semibold text-gray-scale-900">
            Learn with expert <br /> Anytime anywhere
          </h1>
          <p className="text-body-2xl font-light text-gray-scale-700">
            Our mision is to help people to find the best course <br /> online
            and learn with expert anytime, anywhere.
          </p>
          <Button text="Create Account" type="primary" />
        </div>
        <Image width={700} height={500} src="/hero.jpg" alt="hero" />
      </div>
    </section>
  );
}
