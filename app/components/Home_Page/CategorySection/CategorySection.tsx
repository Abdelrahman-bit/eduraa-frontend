import React from "react";
import CategoryCard from "./CategoryCard";

import { AiOutlineCalculator } from "react-icons/ai";
import { FaLongArrowAltRight } from "react-icons/fa";

export default function CategorySection() {
  return (
    <section className=" py-20  ">
      <div className="section-boundary flex flex-col gap-10">
        <h2 className="section-header text-center">Browse top category</h2>
        {/* categories grid  TODO : make this dynamic later */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <CategoryCard
            icon={<AiOutlineCalculator size={24} />}
            iconColor="#6050E7"
            backgroundColor="#EBEBFF"
            title="Mathematics"
            courseCount={365}
          />
          <CategoryCard
            icon={<AiOutlineCalculator size={24} />}
            iconColor="#FF6B00"
            backgroundColor="#E1F7E3"
            title="Science"
            courseCount={452}
          />
          <CategoryCard
            icon={<AiOutlineCalculator size={24} />}
            iconColor="#FF8A00"
            backgroundColor="#FFF2E5"
            title="History"
            courseCount={952}
          />
          <CategoryCard
            icon={<AiOutlineCalculator size={24} />}
            iconColor="#6050E7"
            backgroundColor="#FFF2E5"
            title="History"
            courseCount={952}
          />
          <CategoryCard
            icon={<AiOutlineCalculator size={24} />}
            iconColor="#6050E7"
            backgroundColor="#EBEBFF"
            title="Mathematics"
            courseCount={365}
          />
          <CategoryCard
            icon={<AiOutlineCalculator size={24} />}
            iconColor="#FF8A00"
            backgroundColor="#FFF2E5"
            title="History"
            courseCount={952}
          />
          <CategoryCard
            icon={<AiOutlineCalculator size={24} />}
            iconColor="#6050E7"
            backgroundColor="#FFF2E5"
            title="History"
            courseCount={952}
          />
          <CategoryCard
            icon={<AiOutlineCalculator size={24} />}
            iconColor="#6050E7"
            backgroundColor="#EBEBFF"
            title="Mathematics"
            courseCount={365}
          />
        </div>
        <div className="flex gap-2 items-center justify-center">
          <p className="text-gray-700 text-body-md font-normal">
            We have more category & subcategory.
          </p>
          <div className="flex gap-2 items-center text-primary-500 font-medium cursor-pointer text-body-md ">
            <p className="">Browse All</p>
            <FaLongArrowAltRight />
          </div>
        </div>
      </div>
    </section>
  );
}
