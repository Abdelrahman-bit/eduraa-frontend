type ButtonProps = {
  text: string;
  type?: "primary" | "secondary";
};

export default function Button({ text, type = "primary" }: ButtonProps) {
  const baseClasses =
    "cursor-pointer py-3 px-6 text-[16px] font-semibold transition-all duration-400";

  const styles =
    type === "primary"
      ? "bg-primary-500 text-primary-100 hover:shadow-[0_6px_20px_#CC522B80]"
      : "bg-primary-100 text-primary-500 hover:shadow-[0_6px_20px_#CC522B80]";

  return <button className={`${baseClasses} ${styles}`}>{text}</button>;
}
