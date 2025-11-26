import * as yup from "yup";

export const clientYupSchema = yup.object({

  clientName: yup
    .string()
    .required("Введите имя клиента"),

  lastname: yup
    .string()
    .required("Введите фамилию клиента"),

  numberOfPhone: yup
    .string()
    .required("Введите номер телефона"),
    
  price: yup
    .number()
    .typeError("Стоимость должна быть числом")
    .positive("Стоимость должна быть положительной")
    .required("Укажите стоимость"),
  nameOfWatch: yup
    .string()
    .required("Введите название часов"),

  reason: yup
    .string()
    .required("Укажите причину обращения"),

  viewOfWatch: yup
    .string()
    .required("Опишите внешний вид часов"),

  warrantyMonths: yup
    .number()
    .typeError("Введите количество месяцев гарантии числом")
    .required("Укажите гарантийный срок"),

  dateIn: yup
    .date()
    .typeError("Введите количество месяцев гарантии числом")
    .required("Укажите гарантийный срок"),
  dateOut: yup
    .date()
    .typeError("Введите количество месяцев гарантии числом")
    .required("Укажите гарантийный срок"),

  hasWarranty: yup
    .boolean()
    .required("Укажите, есть ли гарантия"),

  accepted: yup
    .boolean()
    .required("Укажите, приняты ли часы в работу"),

  isConflictClient: yup
    .boolean()
    .default(false),

});
