"use client";

const CategoryCard = ({ image, title, items }) => {
  return (
    <div className="bg-white rounded-[12px] flex p-[18px] items-stretch gap-[16px]">
      <img
        src={image}
        alt={title}
        className="aspect-[0.69] object-contain object-center w-[120px] rounded-none flex-shrink-0 max-w-full"
      />
      <div className="self-start">
        <div className="text-black text-[16px] font-semibold text-center">
          {title}
        </div>
        <div className="text-[#535353] text-[14px] font-normal leading-[22px] mt-[10px]">
          {items.map((item, index) => (
            <div key={index}>{item}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
