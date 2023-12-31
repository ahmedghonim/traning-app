import { Button, Card, Input, Text, TextArea, UploadInput } from "components";
import { Form, Formik, FormikHelpers } from "formik";
import { useDeleteQuery, usePostQuery } from "hooks/useQueryHooks";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import formData from "util/formData";

const initialValues = {
  name: "",
  image: "",
  notes: "",
  muscle_image: "",
  internal_video: "",
  external_video: "",
  video_type: "internal",
};

function SideBar({ exerciseData, categoryData }: any) {
  const isEditing = exerciseData?.exercise_category_id === undefined;

  const onClose = () => {
    document.getElementById("my-drawer")?.click();
  };

  const url = isEditing ? `/exercises/${exerciseData?.id}` : "/exercises";

  // exercises actions =====================>
  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = useDeleteQuery();

  const onDeleteItem = async () => {
    try {
      await mutateAsync(`/exercises/${exerciseData.id}`);

      await queryClient.invalidateQueries(
        `/exercises?exercise_category_id=${categoryData.id}`
      );

      onClose();
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const { mutateAsync: mutatExercise, isLoading: isEditLoading } = usePostQuery(
    {
      url,
      contentType: "multipart/form-data",
    }
  );

  const onSubmit = async (values: any, helpers: FormikHelpers<any>) => {
    try {
      typeof values.muscle_image !== "object" && delete values.muscle_image;

      typeof values.image !== "object" && delete values.image;

      if (isEditing) {
        await mutatExercise(
          formData({
            ...values,
            exercise_category_id: categoryData?.id,
            _method: "PUT",
          }) as any
        );
      } else {
        await mutatExercise(
          formData({
            ...values,
            exercise_category_id: exerciseData?.exercise_category_id,
          }) as any
        );
      }
      helpers.resetForm();

      onClose();

      queryClient.invalidateQueries(
        `/exercises?exercise_category_id=${categoryData.id}`
      );
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  // on delete video =============>
  const deleteVideoURL = `exercises-remove-video/${exerciseData?.id}`;

  const { mutateAsync: deleteVideo, isLoading: isDeleteLoading } = usePostQuery(
    { url: deleteVideoURL, withToast: false }
  );
  const onDeleteVideo = async () => {
    await deleteVideo();

    await queryClient.invalidateQueries(
      `/exercises?exercise_category_id=${categoryData.id}`
    );

    toast.success("تم حذف الفيديو بنجاح");
    onClose();
    try {
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <Formik
      onSubmit={onSubmit}
      initialValues={{
        ...initialValues,
        ...exerciseData,
        video_type:
          exerciseData?.internal_video !== undefined ? "internal" : "external",
      }}
      enableReinitialize
    >
      {({ values, setFieldValue }) => (
        <Form className="flex flex-col gap-10">
          <div className="flex gap-5 justify-between w-full">
            <div className="flex gap-5 ">
              <UploadInput name="image" className="w-24 rounded-2xl" />

              <div className="flex flex-col ">
                <Input name="name" label="اسم العضلة" />
              </div>
            </div>
            <Card className="!w-fit p-6 text-white text-lg">
              {categoryData?.name}
            </Card>
          </div>
          <Card className="p-4">
            <div className="flex gap-5">
              <Text size="3xl">الفيديو </Text>
              <hr />
              <div className="flex gap-4 items-center">
                <div>
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                      <label htmlFor="internal" className="mb-2">
                        رفع من الجهاز
                      </label>
                      <input
                        id="internal"
                        name="video_type"
                        type="radio"
                        checked={values.video_type === "internal"}
                        onChange={() => setFieldValue("video_type", "internal")}
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
                        checked={values.video_type === "external"}
                        onChange={() => setFieldValue("video_type", "external")}
                      />
                    </div>
                  </div>

                  {values?.video_type === "external" ? (
                    <Input name="external_video" label={"رابط الفيديو"} />
                  ) : (
                    <div className="w-1/2">
                      <Input
                        type={"file" as any}
                        name="internal_video"
                        accept="video/*"
                        isForm={false}
                        onChange={(e: any) =>
                          setFieldValue("internal_video", e.target?.files[0])
                        }
                      />
                      <Text className="block !w-full">
                        {values.internal_video?.name ?? values.internal_video}
                      </Text>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Button
              danger
              onClick={onDeleteVideo}
              isLoading={isDeleteLoading}
              className="!my-6"
            >
              حذف الفيديو
            </Button>
          </Card>

          <Card className="flex  gap-5 p-4">
            <Text size="3xl">صورة العضلة </Text>
            <hr />
            <UploadInput name="muscle_image" />
          </Card>
          <Card className="flex flex-col gap-5 p-4">
            <Text size="3xl">الملاحظة</Text>
            <hr />
            <TextArea name="notes" />
          </Card>
          <div className="flex justify-center">
            <span
              onClick={() => {
                window.open(
                  values.external_video || values.internal_video,
                  "_blank"
                );
              }}
              className="p-4 bg-primary text-white rounded-lg cursor-pointer"
            >
              تشغيل الفيديو
            </span>
          </div>
          <div className="flex items-center justify-evenly mt-6">
            <Button
              className="w-[100px]"
              primary
              type="submit"
              isLoading={isEditLoading}
            >
              {isEditing ? "تعديل" : "اضافة"}
            </Button>

            <Button className="w-[100px]" primary onClick={onClose}>
              إلغاء
            </Button>
            <Button
              className="w-[100px]"
              danger
              onClick={onDeleteItem}
              isLoading={isLoading}
            >
              حذف
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default SideBar;
