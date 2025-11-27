import Image from "next/image";
import React from "react";
import { FaStar } from "react-icons/fa";
import { LuUserRound } from "react-icons/lu";
import { FiBarChart } from "react-icons/fi";
import { CiClock2 } from "react-icons/ci";
import { FaCheck } from "react-icons/fa6";

import Button from "../../Button/Button";

export default function CourseDetailsCard() {
  return (
    <div className="flex flex-col gap-3 ">
      {/* course Overview details */}
      <div className="flex flex-col  gap-4 p-2">
        <span className="text-label-sm uppercase py-1 px-1.5 text-secondary-700 bg-secondary-100 font-medium self-start">
          Developments
        </span>
        <p className="font-md text-body-xl text-gray-900">
          2021 Complete Python Bootcamp From Zero to Hero in Python
        </p>
        <div className="flex justify-between items-center border-b pb-2 border-gray-100">
          <div className="flex gap-2 items-center">
            <Image
              src="/avatar.jpg"
              alt="Instructor Image"
              width={48}
              height={48}
              className="rounded-full"
            />
            <p className="text-sm font-medium text-gray-700">Kevin Gilbert</p>
          </div>

          <div className="flex gap-1 items-center">
            <FaStar size={16} className="text-primary-500" />
            <p className="text-md font-medium text-gray-900">5.0</p>
            <p className="text-sm font-medium text-gray-500">(357,914)</p>
          </div>
        </div>
        {/*Course features */}
        <div className="flex justify-between gap-4  py-3 ">
          <div className="flex gap-1 items-center">
            <LuUserRound size={20} className="text-secondary-500" />
            <p className="text-sm font-medium text-gray-700">265.5K</p>
            <p className="text-sm  text-gray-500">students</p>
          </div>
          <div className="flex gap-1 items-center">
            <FiBarChart size={20} className="text-danger-500" />
            <p className="text-sm  text-gray-500">Beginner</p>
          </div>
          <div className="flex gap-1 items-center">
            <CiClock2 size={20} className="text-success-700" />
            <p className="text-sm  text-gray-500">6 Hours</p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex gap-1 items-center">
            <p className="text-body-3xl text-gray-scale-900 font-normal">
              $14.00
            </p>
            <p className=" text-gray-500 text-body-lg line-through">$26.00</p>
          </div>
          <Button type="secondary" text="26% off" />
        </div>
      </div>
      {/* What you’ll learn */}
      <div className="border-y border-gray-slate-100 p-2 flex flex-col gap-2">
        <p className="text-label-md uppercase text-gray-900 font-medium">
          What you’ll learn
        </p>
        <ul className="flex flex-col gap-2">
          <li className="flex gap-4 items-center">
            <FaCheck size={24} />
            <p className="text-body-md text-gray-500">
              Learn to use Python professionally, learning both Python 2 and
              Python 3!
            </p>
          </li>
          <li className="flex gap-4 items-center">
            <FaCheck size={24} />
            <p className="text-body-md text-gray-500">
              Learn to use Python professionally, learning both Python 2 and
              Python 3!
            </p>
          </li>
          <li className="flex gap-4 items-center">
            <FaCheck size={24} />
            <p className="text-body-md text-gray-500">
              Create games with Python, like Tic Tac Toe and Blackjack!
            </p>
          </li>
        </ul>
      </div>
      {/* CTA Buttons */}
      <Button text="Unroll Now" />
    </div>
  );
}
