import {
  Button,
  Img,
  Input,
  Select,
  Text,
  TextArea,
  UploadInput,
} from "components";
import { Form, Formik } from "formik";
import { useGetQuery, usePostQuery } from "hooks/useQueryHooks";
import { UseQueryResult } from "react-query";
import { toast } from "react-toastify";
import { useState } from "react";

const initialValues = {
  name: "",
  meal: "",
  image: "",
  meal_ingredients: [],
  prepare: { url: "", video_type: "", steps: [""], video: "" },
};

export default function AddDescription() {
  //   get ingredient data ====================>
  //   const ingredientURL = "";

  //   const {
  //     data: ingredients = [],
  //     isLoading: isListLoading,
  //   }: UseQueryResult<any> = useGetQuery(url, url, {
  //     select: ({ data }: { data: { data: any[] } }) =>
  //       data.data.map((item: any) => ({
  //         value: item.id,
  //         label: item.name,
  //       })),
  //   });

  // get diet categories ================>
  const { data: categories }: UseQueryResult<any> = useGetQuery(
    "diet-categories",
    "diet-categories",
    {
      select: ({ data }: { data: { data: [] } }) =>
        data.data.map((category: any) => ({
          label: category.name,
          value: category.id,
        })),
    }
  );

  const onClose = () => document.getElementById("my_modal")?.click();

  const mealsTypes = [
    { label: "وجبة فطار", value: "Breakfast" },
    { label: "وجبة غداء", value: "Lunch" },
    { label: "وجبة سناكس", value: "Snack" },
    { label: "وجبة عشاء", value: "Dinner" },
  ];

  const onRemoveStep = (
    values: any,
    setFieldValue: any,
    deletedStep: string
  ) => {
    const filteredArray = values.prepare.steps?.filter(
      (step: string) => step !== deletedStep
    );

    setFieldValue("prepare", {
      ...values.prepare,
      steps: filteredArray,
    });
  };

  // on submit meal data ======================>
  const url = "/diet-meals";
  const { mutateAsync, isLoading } = usePostQuery({
    url,
    contentType: "multipart/form-data",
  });

  const onSubmit = async (values: any, Helpers: any) => {
    const formData = new FormData();

    values.prepare.video_type === "external"
      ? delete values.prepare.video
      : delete values.prepare.url;

    const formattedValues = Object.entries(values);

    formattedValues.forEach((value) =>
      value[0] !== "prepare"
        ? formData.append(value[0], value[1] as any)
        : Object.entries(value[1] as any).forEach((subValue) =>
            subValue[0] !== "steps"
              ? formData.append(`prepare[${subValue[0]}]`, subValue[1] as any)
              : (subValue[1] as any).forEach((step: string, index: number) =>
                  formData.append(`prepare[steps][${index}]`, step as any)
                )
          )
    );

    try {
      await mutateAsync(formData as any);

      Helpers.resetForm();

      onClose();
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const [step, setStep] = useState<string>("");

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      {({ values, setFieldValue }) => (
        <Form>
          <UploadInput name="image" />
          <div>
            <Text>معلومات عن الوجبة:</Text>
            <div className="grid grid-cols-2 gap-4">
              <Input name="name" label={"اسم الوجبة"} />
              <Select options={mealsTypes} name="meal" label={"نوع الوجبة"} />
              <Select
                options={categories}
                name="diet_category_id"
                label={"فئة الوجبة"}
              />
            </div>
          </div>

          <div className="my-8">
            <Text as={"h2"} className="mb-2">
              مكونات الوجبة:
            </Text>
            <Select
              options={[]}
              name="meal_ingredients"
              isMulti
              onChange={(val: any) =>
                setFieldValue(
                  "meal_ingredients",
                  val.map(
                    (ingredient: { label: string; value: number }) => ingredient
                  )
                )
              }
            />
          </div>

          <div>
            <Text>تحضير الوجبة:</Text>

            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <label htmlFor="internal" className="mb-2">
                  رفع من الجهاز
                </label>
                <input
                  id="internal"
                  name="video_type"
                  type="radio"
                  onChange={() =>
                    setFieldValue("prepare.video_type", "internal")
                  }
                />
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="external" className="mb-2">
                  ادخال رابط
                </label>
                <input
                  id="external"
                  name="video_type"
                  type="radio"
                  onChange={() =>
                    setFieldValue("prepare.video_type", "external")
                  }
                />
              </div>
            </div>

            {values.prepare?.video_type === "external" ? (
              <Input name="prepare.url" label={"رابط الفيديو"} />
            ) : (
              <Input
                type={"file" as any}
                name="prepare.video"
                accept="video/*"
                isForm={false}
                onChange={(e: any) =>
                  setFieldValue("prepare", {
                    ...values.prepare,
                    video: e.target?.files[0],
                  })
                }
              />
            )}
          </div>
          <div className="flex items-center gap-4">
            <TextArea
              name={""}
              label="تفاصيل الخطوة"
              className="h-full border-[2px] border-primary rounded-md"
              isForm={false}
              value={step}
              onChange={(e) => setStep(e.target.value)}
            />
            <Button
              secondaryBorder
              onClick={() =>
                setFieldValue("prepare", {
                  ...values.prepare,
                  steps: [...values.prepare.steps, step],
                })
              }
            >
              إضافة خطوة
            </Button>
          </div>
          <div className="mt-6">
            <Text>خطوات التحضير:</Text>
            {values.prepare.steps.map((step: string, index: number) => (
              <div key={step} className="my-4">
                <div className="flex flex-col">
                  <Text>{`خطوة رقم ${index + 1}`}</Text>

                  <Text>{step}</Text>
                </div>
                <Button
                  onClick={() =>
                    onRemoveStep(
                      values,
                      setFieldValue,
                      values.prepare?.steps?.[index]
                    )
                  }
                >
                  <Img src="/images/trash.svg" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end gap-4 mt-8">
            <Button
              className="w-[100px]"
              primary
              type="submit"
              isLoading={isLoading}
            >
              {"حفظ"}
            </Button>
            <Button className="w-[100px]" secondaryBorder onClick={onClose}>
              إلغاء
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
