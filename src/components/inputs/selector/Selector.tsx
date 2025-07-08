import "./selector.css";

import { Select } from "antd";
import { FaAngleDown } from "react-icons/fa6";

import { TInvoice } from "@/types/types";

type Props = {
  onChange: React.Dispatch<Omit<TInvoice, "id" | "total">>;
  formData: Omit<TInvoice, "id" | "total">;
  value: number;
};

const Selector = ({ onChange: setFormData, formData, value }: Props) => {
  return (
    <>
      <Select
        style={{
          width: "100%",
        }}
        suffixIcon={<FaAngleDown color="#7C5DFA" />}
        size="large"
        optionFilterProp="children"
        onChange={(value) => {
          setFormData({
            ...formData,
            paymentTerms: +value,
          });
        }}
        value={`Net ${value} ${value === 1 ? "Day" : "Days"}`}
        options={[
          {
            value: 1,
            label: "Net 1 Day",
          },
          {
            value: 7,
            label: "Net 7 Days",
          },
          {
            value: 14,
            label: "Net 14 Days",
          },
          {
            value: 30,
            label: "Net 30 Days",
          },
        ]}
      />
    </>
  );
};

export default Selector;
