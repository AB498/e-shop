"use client";

const CategoryCard = ({ image, title, items }) => {
  return (
    <div className="bg-white rounded-[20px] flex p-[26px] items-stretch gap-[21px]">
      <img
        src={image}
        alt={title}
        className="aspect-[0.69] object-contain object-center w-[154px] rounded-none flex-shrink-0 max-w-full"
      />
      <div className="self-start">
        <div className="text-black text-[18px] font-semibold text-center">
          {title}
        </div>
        <div className="text-[#535353] text-[16px] font-normal leading-[27px] mt-[13px]">
          {items.map((item, index) => (
            <div key={index}>{item}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
