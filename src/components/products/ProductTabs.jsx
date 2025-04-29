import React from 'react';

const ProductTabs = () => {
  return (
    <div className="bg-white rounded-[15px] p-6 shadow-[5px_5px_15px_0px_rgba(0,0,0,0.05)] mb-6 border border-[#DEDEDE]">
      {/* Tab Navigation */}
      <div className="flex gap-4 mb-8">
        <button className="py-3 px-6 rounded-[30px] bg-white text-[#3BB77E] font-bold text-[17px] shadow-[5px_5px_15px_0px_rgba(0,0,0,0.05)] border border-[#ECECEC]">
          Description
        </button>
        <button className="py-3 px-6 rounded-[30px] bg-white text-[#7E7E7E] font-bold text-[17px] border border-[#ECECEC]">
          Additional info
        </button>
        <button className="py-3 px-6 rounded-[30px] bg-white text-[#7E7E7E] font-bold text-[17px] border border-[#ECECEC]">
          Vendor
        </button>
        <button className="py-3 px-6 rounded-[30px] bg-white text-[#7E7E7E] font-bold text-[17px] border border-[#ECECEC]">
          Reviews (3)
        </button>
      </div>

      {/* Tab Content */}
      <div className="text-[#7E7E7E]">
        <p className="text-base mb-4">
          Uninhibited carnally hired played in whimpered dear gorilla koala depending and much yikes off far quetzal goodness and from for grimaced goodness unaccountably and meadowlark near unblushingly crucial scallop tightly neurotic hungrily some and dear furiously this apart.
        </p>
        <p className="text-base mb-6">
          Spluttered narrowly yikes left moth in yikes bowed this that grizzly much hello on spoon-fed that alas rethought much decently richly and wow against the frequent fluidly at formidable acceptably flapped besides and much circa far over the bucolically hey precarious goldfinch mastodon goodness gnashed a jellyfish and one however because.
        </p>

        {/* Product Specifications */}
        <div className="mb-6">
          <div className="flex mb-2">
            <span className="text-[#7E7E7E] font-normal w-1/3">Type Of Packing</span>
            <span className="text-[#7E7E7E] font-normal bg-[#9B9B9B] bg-opacity-10 px-3 py-1 rounded-md">Bottle</span>
          </div>
          <div className="flex mb-2">
            <span className="text-[#7E7E7E] font-normal w-1/3">Color</span>
            <span className="text-[#7E7E7E] font-normal bg-[#9B9B9B] bg-opacity-10 px-3 py-1 rounded-md">Green, Pink, Powder Blue, Purple</span>
          </div>
          <div className="flex mb-2">
            <span className="text-[#7E7E7E] font-normal w-1/3">Quantity Per Case</span>
            <span className="text-[#7E7E7E] font-normal bg-[#9B9B9B] bg-opacity-10 px-3 py-1 rounded-md">100ml</span>
          </div>
          <div className="flex mb-2">
            <span className="text-[#7E7E7E] font-normal w-1/3">Ethyl Alcohol</span>
            <span className="text-[#7E7E7E] font-normal bg-[#9B9B9B] bg-opacity-10 px-3 py-1 rounded-md">70%</span>
          </div>
          <div className="flex mb-2">
            <span className="text-[#7E7E7E] font-normal w-1/3">Piece In One</span>
            <span className="text-[#7E7E7E] font-normal bg-[#9B9B9B] bg-opacity-10 px-3 py-1 rounded-md">Carton</span>
          </div>
        </div>

        <div className="border-t border-[#7E7E7E] border-opacity-25 pt-6 mb-6">
          <p className="text-base mb-6">
            Laconic overheard dear woodchuck wow this outrageously taut beaver hey hello far meadowlark imitatively egregiously hugged that yikes minimally unanimous pouted flirtatiously as beaver beheld above forward energetic across this jeepers beneficently cockily less a the raucously that magic upheld far so the this where crud then below after jeez enchanting drunkenly more much wow callously irrespective limpet.
          </p>

          <h3 className="text-[#253D4E] text-2xl font-bold mb-4">Packaging & Delivery</h3>

          <div className="border-t border-[#7E7E7E] border-opacity-25 pt-6 mb-6"></div>

          <p className="text-base mb-4">
            Less lion goodness that euphemistically robin expeditiously bluebird smugly scratched far while thus cackled sheepishly rigid after due one assenting regarding censorious while occasional or this more crane went more as this less much amid overhung anathematic because much held one exuberantly sheep goodness so where rat wry well concomitantly.
          </p>

          <p className="text-base mb-6">
            Scallop or far crud plain remarkably far by thus far iguana lewd precociously and and less rattlesnake contrary caustic wow this near alas and next and pled the yikes articulate about as less cackled dalmatian in much less well jeering for the thanks blindly sentimental whimpered less across objectively fanciful grimaced wildly some wow and rose jeepers outgrew lugubrious luridly irrationally attractively dachshund.
          </p>

          <h3 className="text-[#253D4E] text-2xl font-bold mb-4">Suggested Use</h3>

          <ul className="list-disc pl-6 mb-6">
            <li className="text-[#7E7E7E] mb-2">Refrigeration not necessary.</li>
            <li className="text-[#7E7E7E] mb-2">Stir before serving</li>
          </ul>

          <h3 className="text-[#253D4E] text-2xl font-bold mb-4">Other Ingredients</h3>

          <ul className="list-disc pl-6 mb-6">
            <li className="text-[#7E7E7E] mb-2">Organic raw pecans, organic raw cashews.</li>
            <li className="text-[#7E7E7E] mb-2">This butter was produced using a LTG (Low Temperature Grinding) process</li>
            <li className="text-[#7E7E7E] mb-2">Made in machinery that processes tree nuts but does not process peanuts, gluten, dairy or soy</li>
          </ul>

          <h3 className="text-[#253D4E] text-2xl font-bold mb-4">Warnings</h3>

          <ul className="list-disc pl-6">
            <li className="text-[#7E7E7E]">Oil separation occurs naturally. May contain pieces of shell.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductTabs;
