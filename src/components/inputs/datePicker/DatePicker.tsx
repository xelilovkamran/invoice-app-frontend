import "./datePicker.css";

import { DatePicker, Space } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";

import { type TInvoice } from "@/types/types";

const dateFormat = "DD MMM YYYY";
dayjs.extend(updateLocale);
dayjs.updateLocale("en", {
  weekStart: 1,
});

type Props = {
  onChange: React.Dispatch<Omit<TInvoice, "id" | "total">>;
  formData: Omit<TInvoice, "id" | "total">;
  value: Dayjs;
};

function Datepicker({ onChange: setFormData, formData, value }: Props) {
  const customFormat = (value: Dayjs) => `${value.format(dateFormat)}`;
  return (
    <Space className="flex-1">
      <DatePicker
        className="w-full px-5 py-3 text-base font-bold leading-4 border-[#DFE3FA] rounded-md"
        allowClear={false}
        format={customFormat}
        value={value}
        onChange={(value) => {
          setFormData({
            ...formData,
            paymentDue: value ? dayjs(value).format("YYYY-MM-DD") : "",
          } as TInvoice);
        }}
      />
    </Space>
  );
}

export default Datepicker;
