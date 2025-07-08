import "./paymentItem.css";

import { FaTrash } from "react-icons/fa6";

import { TInvoice, TPaymentItem } from "@/types/types";

type Props = {
  data: Omit<TInvoice, "id" | "total">;
  setData: React.Dispatch<Omit<TInvoice, "id" | "total">>;
  index: number;
};

function PaymentItem({ data, setData, index }: Props) {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let targetValue =
      e.target.type === "number" ? Number(e.target.value) : e.target.value;

    // ?  WITHOUT THIS CONDITION, USER WILL NOT BE ABLE TO DELATE ZERO TO WRITE ANOTHER VALUE
    if (!e.target.value && e.target.type === "number") {
      targetValue = "";
    }

    if (!e.target.value) {
      e.target.classList.add("border-red-500");
    } else {
      e.target.classList.remove("border-red-500");
    }

    setData({
      ...data,
      items: data.items.map((item: TPaymentItem, i: number) =>
        i === index
          ? {
              ...item,
              [e.target.name]: targetValue,
              total:
                typeof targetValue === "number"
                  ? Number(
                      (
                        targetValue *
                        (e.target.name === "quantity"
                          ? item.price
                          : item.quantity)
                      ).toFixed(2)
                    )
                  : item.total,
            }
          : item
      ),
    });
  };

  const onClick = () => {
    setData({
      ...data,
      items: data.items.filter((_item, i) => index !== i),
    });
  };

  return (
    <div className="grid grid-cols-12 gap-4 mb-5">
      <div className="sm:col-span-5 col-span-12 flex flex-col gap-4">
        <div className="sm:hidden block text-sm font-medium leading-4  text-[#7E88C3]">
          Item Name
        </div>
        <div>
          <input
            type="text"
            name="name"
            value={data.items[index].name}
            onChange={onChange}
            className="w-full py-3 px-5 outline-none rounded-[4px] border border-[#DFE3FA] text-[13px] font-bold leading-4"
          />
        </div>
      </div>
      <div className="sm:col-span-2 col-span-3 flex flex-col gap-4 w-full">
        <div className="sm:hidden block text-sm font-medium leading-4  text-[#7E88C3]">
          Qty.
        </div>
        <div className="w-full">
          <input
            type="number"
            name="quantity"
            value={data.items[index].quantity}
            onChange={onChange}
            className="quantityInput w-full px-2 py-3 outline-none rounded-[4px] border border-[#DFE3FA] text-[13px] font-bold leading-4"
          />
        </div>
      </div>
      <div className="sm:col-span-2 col-span-4 flex flex-col gap-4">
        <div className="sm:hidden block text-sm font-medium leading-4  text-[#7E88C3]">
          Price
        </div>
        <div>
          <input
            type="number"
            name="price"
            value={data.items[index].price}
            onChange={onChange}
            className="priceInput w-full px-2 py-3 outline-none rounded-[4px] border border-[#DFE3FA] text-[13px] font-bold leading-4"
          />
        </div>
      </div>
      <div className="sm:col-span-2 col-span-3 flex flex-col gap-4">
        <div className="sm:hidden block text-sm font-medium leading-4  text-[#7E88C3]">
          Total
        </div>
        <div className="totalCost overflow-x-auto px-2 py-3 text-[13px] font-bold leading-4">
          {data.items[index].total}
        </div>
      </div>
      <div className="sm:col-span-1 col-span-2 flex flex-col gap-4 justify-center">
        <div className="h-full flex sm:items-center items-end sm:mb-0 mb-3">
          <FaTrash
            className="text-[#888EB0] hover:text-[#EC5757] cursor-pointer"
            onClick={onClick}
          />
        </div>
      </div>
    </div>
  );
}

export default PaymentItem;
