import { useEffect, useState } from "react";

import { type TInvoice, type TPaymentItem } from "@/types/types";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ValidationErrors = {
  description?: string;
  clientName?: string;
  clientEmail?: string;
  senderAddress?: string;
  clientAddress?: string;
  items?: string;
  emptyItem?: string;
};

function useValidateForm(data: Omit<TInvoice, "id" | "total">) {
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const newValidationErrors: ValidationErrors = {};
    let newIsValid = true;

    if (!data.description) {
      newValidationErrors.description = "can't be empty";
      newIsValid = false;
    } else {
      delete validationErrors.description;
    }

    if (!data.clientName) {
      newValidationErrors.clientName = "can't be empty";
      newIsValid = false;
    } else {
      delete validationErrors.clientName;
    }

    if (!data.clientEmail || !emailRegex.test(data.clientEmail)) {
      if (emailRegex.test(data.clientEmail)) {
        newValidationErrors.clientEmail = "can't be empty";
      } else {
        newValidationErrors.clientEmail = "invalid email";
      }
      newIsValid = false;
    } else {
      delete validationErrors.clientEmail;
    }

    if (
      !data.senderAddress.street ||
      !data.senderAddress.city ||
      !data.senderAddress.postCode ||
      !data.senderAddress.country
    ) {
      newValidationErrors.senderAddress =
        "Client's address fields can't be empty";
      newIsValid = false;
    } else {
      delete validationErrors.senderAddress;
    }

    if (
      !data.clientAddress.street ||
      !data.clientAddress.city ||
      !data.clientAddress.postCode ||
      !data.clientAddress.country
    ) {
      newValidationErrors.clientAddress =
        "Client's address fields can't be empty";
      newIsValid = false;
    } else {
      delete validationErrors.clientAddress;
    }

    if (!data.items.length) {
      newValidationErrors.items = "At least, has to be one item";
      delete validationErrors.emptyItem;
      newIsValid = false;
    } else {
      delete validationErrors.items;
    }

    data.items.forEach((item: TPaymentItem) => {
      Object.values(item).forEach((value) => {
        if (!value) {
          newValidationErrors.emptyItem = `Each field of items has to be filled`;
          newIsValid = false;
        } else {
          delete validationErrors.emptyItem;
        }
      });
    });

    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      ...newValidationErrors,
    }));
    setIsValid(newIsValid);

    // eslint-disable-next-line
  }, [data]);

  return { isValid, validationErrors };
}

export default useValidateForm;
