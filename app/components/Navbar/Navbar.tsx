import Link from "next/link";
import { IoIosMoon } from "react-icons/io";

import { IoMdNotificationsOutline } from "react-icons/io";
import Button from "../Button/Button";
import Image from "next/image";

export default function Navbar() {
  return (
    <>
      {/* Secondary NavBar  */}
      <nav className="flex justify-between bg-gray-scale-900 text-gray-scale-500 px-6 text-body-md font-medium">
        <ul className="flex gap-8 p-4">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/courses">Courses</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
        </ul>
        <ul className="flex gap-8 p-4">
          <li>
            {/* //TODO */}
            <Link href="/mode">Dark</Link>
          </li>
          <li>
            {/* //TODO */}
            <Link href="/language">English</Link>
          </li>
        </ul>
      </nav>
      {/* Main NavBar  */}
      <nav className="flex justify-between px-8 py-4 border-b-2 border-gray-scale-100">
        <ul className="flex gap-6 items-center">
          {/* Todo  */}
          <li>
            <Image
              src="/GraduationCap.png"
              alt="eTutor Logo"
              width={40}
              height={40}
            />
          </li>
          <li>
            <select
              name=""
              id=""
              className="w-50 h-12 border-2 border-gray-scale-100 px-2"
            >
              <option value="Courses">Browse</option>
              <option value="Courses">Courses</option>
              <option value="Teachers">Teachers</option>
              <option value="Students">Students</option>
            </select>
          </li>
          <li>
            <input
              type="text"
              placeholder="What do you want to learn"
              className="w-106 h-12 border-2 border-gray-scale-100 px-2"
            />
          </li>
        </ul>
        <ul className="flex gap-3 items-center">
          {/* Icons */}
          <li>
            <ul className="flex gap-3 text-gray-scale-900">
              <li>
                <IoIosMoon size={24} />
              </li>
              <li>
                <IoMdNotificationsOutline size={24} />
              </li>
            </ul>
          </li>
          <li>
            <Button text="Create an Account" type="secondary" />
          </li>
          <li>
            <Button text="Sign In" type="primary" />
          </li>
        </ul>
      </nav>
    </>
  );
}
