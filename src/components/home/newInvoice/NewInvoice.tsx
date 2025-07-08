import "./newInvoice.css";

import dayjs from "dayjs";
import { customAlphabet } from "nanoid";
import React, { useRef, useState } from "react";

import Button from "@/components/buttons/primaryButton/Button";
import PaymentItem from "@/components/home/paymentItem/PaymentItem";
import Datepicker from "@/components/inputs/datePicker/DatePicker";
import Selector from "@/components/inputs/selector/Selector";
import useValidateForm from "@/hooks/useValidateForm";
import { useInvoiceActions } from "@/store/invoice/actions";
import { type TAddress, type TInvoice, type TPaymentItem } from "@/types/types";

type Props = {
  reference: React.MutableRefObject<HTMLDivElement>;
};

function NewInvoice({ reference }: Props) {
  const { postInvoiceAction } = useInvoiceActions();
  const ref = useRef<HTMLDivElement>();
  const [isSubmited, setIsSubmited] = useState<boolean>(false);
  const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 6);

  const [formData, setFormData] = useState<Omit<TInvoice, "id" | "total">>({
    identifier: nanoid().toUpperCase(),
    createdAt: dayjs().format("YYYY-MM-DD"),
    paymentDue: dayjs().format("YYYY-MM-DD"),
    description: "",
    paymentTerms: 30,
    clientName: "",
    clientEmail: "",
    status: "",
    senderAddress: {
      street: "",
      city: "",
      postCode: "",
      country: "",
    },
    clientAddress: {
      street: "",
      city: "",
      postCode: "",
      country: "",
    },
    items: [],
    // total: 0,
  });
  const { isValid, validationErrors } = useValidateForm(formData);

  // ?  WHEN USER CLICK OUTSIDE OF THIS COMPONENT, THIS WILL CLOSE AND STATE WILL NOT BE CLEARED.(CAN BE REMOVED)
  document.getElementById("root")?.addEventListener("click", (e) => {
    const target = e.target as HTMLDivElement;
    if (
      target?.id === "root" &&
      reference.current?.classList.replace("translate-x-0", "-translate-x-full")
    ) {
      hideNewInvoice();
    }
  });

  const clearFormData = () => {
    const formDataEmpty: Omit<TInvoice, "id" | "total"> = {
      identifier: nanoid(6).toUpperCase(),
      createdAt: dayjs().format("YYYY-MM-DD"),
      paymentDue: dayjs().format("YYYY-MM-DD"),
      description: "",
      paymentTerms: 30,
      clientName: "",
      clientEmail: "",
      status: "",
      senderAddress: {
        street: "",
        city: "",
        postCode: "",
        country: "",
      },
      clientAddress: {
        street: "",
        city: "",
        postCode: "",
        country: "",
      },
      items: [],
      // total: 0,
    };

    setFormData(formDataEmpty);
  };

  const hideNewInvoice = () => {
    reference.current?.classList.replace("translate-x-0", "-translate-x-full");
    reference.current?.classList.remove("active");
    document
      .getElementById("root")
      ?.setAttribute("class", "bg-[#F8F8FB] relative");
  };

  const cancelNewInvoice = () => {
    hideNewInvoice();
    clearFormData();
  };

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetData = e.target.name;
    if (targetData.includes(".")) {
      const targets = targetData.split(".");
      setFormData({
        ...formData,
        [targets[0]]: {
          ...(formData[
            targets[0] as keyof Omit<TInvoice, "id" | "total">
          ] as TAddress),
          [targets[1]]: e.target.value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const addNewItem = () => {
    !ref.current?.classList.contains("sm:grid") &&
      ref.current?.classList.add("sm:grid");

    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          name: "",
          quantity: 0,
          price: 0,
          total: 0,
        },
      ],
    });
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement>,
    status: string
  ) => {
    e.preventDefault();
    setIsSubmited(true);

    if (isValid) {
      const formDataCopy = {
        ...formData,
        status,
      };

      postInvoiceAction(formDataCopy);
      // .unwrap()
      // .then(() => toast.success("Invoice created successfully :)"))
      // .catch((err: Error) => {
      //   err.message === "bad connection"
      //     ? toast.error("Bad connection")
      //     : toast.error("Something went wrong");
      // });

      cancelNewInvoice();
      setIsSubmited(false);
    }
  };

  return (
    <div
      ref={reference as React.RefObject<HTMLDivElement>}
      className={`h-full absolute z-[1] -translate-x-full transition-all duration-200 ease delay-0 flex flex-col justify-between rounded-3xl`}
    >
      <div className="scrollbar-area bg-[#ececf0] flex-1 rounded-tr-3xl tablet:pl-40 tablet:pr-4 overflow-y-auto max-tablet:px-8 max-tablet:mt-24">
        <h3 className="text-left text-2xl font-bold leading-8 py-10 text-[#0C0E16]">
          New Invoice
        </h3>
        <form className="max-w-lg">
          <div className="w-full mb-12">
            <h4 className="text-base font-bold leading-4 text-[#7C5DFA] mb-6">
              Bill From
            </h4>
            <div className="mb-6 w-full">
              <div className="flex justify-between items-center">
                <p
                  className={`mb-2 text-sm font-semibold leading-4 text-[#7E88C3] ${
                    isSubmited &&
                    validationErrors.senderAddress &&
                    "text-[#EC5757]"
                  }`}
                >
                  Street Address
                </p>

                {validationErrors.senderAddress && isSubmited && (
                  <div className="text-xs font-semibold leading-4 text-[#EC5757]">
                    {validationErrors.senderAddress}
                  </div>
                )}
              </div>
              <input
                type="text"
                name="senderAddress.street"
                className="px-5 py-3 w-full outline-none border-[1px] rounded-md border-[#DFE3FA] hover:border-[#9277FF] focus:border-[#9277FF] text-base font-bold  leading-4 text-[#0C0E16]"
                value={formData.senderAddress.street}
                onChange={onInput}
              />
            </div>
            <div className="flex gap-6 w-full">
              <div className="flex-grow">
                <p className="mb-2 text-sm font-semibold leading-4 text-[#7E88C3]">
                  City
                </p>
                <input
                  type="text"
                  name="senderAddress.city"
                  className="px-5 py-3 w-full outline-none border-[1px] rounded-md border-[#DFE3FA] hover:border-[#9277FF] focus:border-[#9277FF] text-base font-bold  leading-4 text-[#0C0E16]"
                  value={formData.senderAddress.city}
                  onChange={onInput}
                />
              </div>
              <div className="flex-grow">
                <p className="mb-2 text-sm font-semibold leading-4 text-[#7E88C3]">
                  Post Code
                </p>
                <input
                  type="text"
                  name="senderAddress.postCode"
                  className="px-5 py-3 w-full outline-none border-[1px] rounded-md border-[#DFE3FA] hover:border-[#9277FF] focus:border-[#9277FF] text-base font-bold  leading-4 text-[#0C0E16]"
                  value={formData.senderAddress.postCode}
                  onChange={onInput}
                />
              </div>
              <div className="flex-grow">
                <p className="mb-2 text-sm font-semibold leading-4 text-[#7E88C3]">
                  Country
                </p>
                <input
                  type="text"
                  name="senderAddress.country"
                  className="px-5 py-3 w-full outline-none border-[1px] rounded-md border-[#DFE3FA] hover:border-[#9277FF] focus:border-[#9277FF] text-base font-bold  leading-4 text-[#0C0E16]"
                  value={formData.senderAddress.country}
                  onChange={onInput}
                />
              </div>
            </div>
          </div>
          <div className="w-full mb-12">
            <h4 className="text-base font-bold leading-4 text-[#7C5DFA] mb-6">
              Bill To
            </h4>
            <div className="mb-6 w-full">
              <div className="flex justify-between items-center">
                <p
                  className={`mb-2 text-sm font-semibold leading-4 text-[#7E88C3] ${
                    isSubmited &&
                    validationErrors.clientName &&
                    "text-[#EC5757]"
                  }`}
                >
                  Client&apos;s Name
                </p>

                {validationErrors.clientName && isSubmited && (
                  <div className="text-xs font-semibold leading-4 text-[#EC5757]">
                    {validationErrors.clientName}
                  </div>
                )}
              </div>
              <input
                type="text"
                name="clientName"
                className="px-5 py-3 w-full outline-none border-[1px] rounded-md border-[#DFE3FA] hover:border-[#9277FF] focus:border-[#9277FF] text-base font-bold  leading-4 text-[#0C0E16]"
                value={formData.clientName}
                onChange={onInput}
              />
            </div>
            <div className="mb-6 w-full">
              <div className="flex justify-between items-center">
                <p
                  className={`mb-2 text-sm font-semibold leading-4 text-[#7E88C3] ${
                    isSubmited &&
                    validationErrors.clientEmail &&
                    "text-[#EC5757]"
                  }`}
                >
                  Client&apos;s Email
                </p>

                {validationErrors.clientEmail && isSubmited && (
                  <div className="text-xs font-semibold leading-4 text-[#EC5757]">
                    {validationErrors.clientEmail}
                  </div>
                )}
              </div>
              <input
                type="text"
                name="clientEmail"
                className="px-5 py-3 w-full outline-none border-[1px] rounded-md border-[#DFE3FA] hover:border-[#9277FF] focus:border-[#9277FF] text-base font-bold  leading-4 text-[#0C0E16]"
                value={formData.clientEmail}
                onChange={onInput}
                placeholder="e.g. email@example.com"
              />
            </div>
            <div className="mb-6 w-full">
              <div className="flex justify-between items-center">
                <p
                  className={`mb-2 text-sm font-semibold leading-4 text-[#7E88C3] ${
                    isSubmited &&
                    validationErrors.clientAddress &&
                    "text-[#EC5757]"
                  }`}
                >
                  Street Address
                </p>

                {validationErrors.clientAddress && isSubmited && (
                  <div className="text-xs font-semibold leading-4 text-[#EC5757]">
                    {validationErrors.clientAddress}
                  </div>
                )}
              </div>
              <input
                type="text"
                name="clientAddress.street"
                className="px-5 py-3 w-full outline-none border-[1px] rounded-md border-[#DFE3FA] hover:border-[#9277FF] focus:border-[#9277FF] text-base font-bold  leading-4 text-[#0C0E16]"
                value={formData.clientAddress.street}
                onChange={onInput}
              />
            </div>
            <div className="flex gap-6 w-full mb-12">
              <div className="flex-grow">
                <p className="mb-2 text-sm font-semibold leading-4 text-[#7E88C3]">
                  City
                </p>
                <input
                  type="text"
                  name="clientAddress.city"
                  className="px-5 py-3 w-full outline-none border-[1px] rounded-md border-[#DFE3FA] hover:border-[#9277FF] focus:border-[#9277FF] text-base font-bold  leading-4 text-[#0C0E16]"
                  value={formData.clientAddress.city}
                  onChange={onInput}
                />
              </div>
              <div className="flex-grow">
                <p className="mb-2 text-sm font-semibold leading-4 text-[#7E88C3]">
                  Post Code
                </p>
                <input
                  type="text"
                  name="clientAddress.postCode"
                  className="px-5 py-3 w-full outline-none border-[1px] rounded-md border-[#DFE3FA] hover:border-[#9277FF] focus:border-[#9277FF] text-base font-bold  leading-4 text-[#0C0E16]"
                  value={formData.clientAddress.postCode}
                  onChange={onInput}
                />
              </div>
              <div className="flex-grow">
                <p className="mb-2 text-sm font-semibold leading-4 text-[#7E88C3]">
                  Country
                </p>
                <input
                  type="text"
                  name="clientAddress.country"
                  className="px-5 py-3 w-full outline-none border-[1px] rounded-md border-[#DFE3FA] hover:border-[#9277FF] focus:border-[#9277FF] text-base font-bold  leading-4 text-[#0C0E16]"
                  value={formData.clientAddress.country}
                  onChange={onInput}
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="flex-1">
                <p className="mb-2 text-sm font-semibold leading-4 text-[#7E88C3]">
                  Invoice Date
                </p>
                <div className="flex">
                  <Datepicker
                    value={dayjs(formData.paymentDue)}
                    formData={formData}
                    onChange={setFormData}
                  />
                </div>
              </div>
              <div className="flex-1 ">
                <p className="mb-2 text-sm font-semibold leading-4 text-[#7E88C3]">
                  Payment Terms
                </p>
                <Selector
                  value={formData.paymentTerms}
                  formData={formData}
                  onChange={setFormData}
                />
              </div>
            </div>
            <div className="mb-4">
              <div className="flex justify-between items-center">
                <p
                  className={`mb-2 text-sm font-semibold leading-4 text-[#7E88C3] ${
                    isSubmited &&
                    validationErrors.description &&
                    "text-[#EC5757]"
                  }`}
                >
                  Project Description
                </p>

                {validationErrors.description && isSubmited && (
                  <div className="text-xs font-semibold leading-4 text-[#EC5757]">
                    {validationErrors.description}
                  </div>
                )}
              </div>
              <input
                type="text"
                name="description"
                className="px-5 py-3 w-full outline-none border-[1px] rounded-md border-[#DFE3FA]  text-base font-bold  leading-4 text-[#0C0E16] hover:border-[#9277FF] focus:border-[#9277FF]"
                placeholder="e.g. Graphic Design Service"
                value={formData.description}
                onChange={onInput}
              />
            </div>
          </div>
          <div className="mb-5">
            <h4 className="text-[#777F98] text-lg font-bold leading-8 mb-3">
              Item List
            </h4>
            <div>
              <div
                className="hidden sm:grid-cols-12 mb-4 gap-4"
                ref={ref as React.RefObject<HTMLDivElement>}
              >
                <div className="col-span-5 text-sm font-semibold leading-4  text-[#7E88C3]">
                  Item Name
                </div>
                <div className="col-span-2 text-sm font-semibold leading-4  text-[#7E88C3]">
                  Qty.
                </div>
                <div className="col-span-2 text-sm font-semibold leading-4  text-[#7E88C3]">
                  Price
                </div>
                <div className="col-span-2 text-sm font-semibold leading-4  text-[#7E88C3]">
                  Total
                </div>
                <div className="col-span-1 "></div>
              </div>
              <div>
                {formData.items.map((_item: TPaymentItem, index: number) => (
                  <div key={index}>
                    <PaymentItem
                      data={formData}
                      setData={setFormData}
                      index={index}
                    />
                  </div>
                ))}
              </div>
            </div>
            <Button text="+ Add New Item" type="newItem" onClick={addNewItem} />
            {(validationErrors.items || validationErrors.emptyItem) &&
              isSubmited && (
                <div className="mt-8 text-xs font-semibold leading-4 text-[#EC5757]">
                  - {validationErrors.items || validationErrors.emptyItem}
                </div>
              )}
          </div>
        </form>
      </div>
      <div className="bg-white rounded-br-3xl tablet:pl-40 py-8 flex justify-between justify-self-start gap-y-4 tablet:pr-14 mobile:px-14 px-4 flex-wrap">
        <Button
          type="discardNewInvoice"
          text="discard"
          onClick={() => {
            cancelNewInvoice();
            setIsSubmited(false);
          }}
        />
        <div className="flex gap-2 flex-wrap">
          <Button
            type="saveDraft"
            text="Save as Draft"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
              handleSubmit(e, "draft")
            }
          />
          <Button
            type="saveSend"
            text="save & send"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
              handleSubmit(e, "pending")
            }
          />
        </div>
      </div>
    </div>
  );
}

export default NewInvoice;
