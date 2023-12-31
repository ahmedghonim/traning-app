import { Button, Img, Modal, Table, Text } from "components";
import React, { useState } from "react";
import { UseQueryResult } from "react-query";
import { useParams } from "react-router-dom";
import { Row } from "react-table";
import AddUserSubscription from "./add-user-subscription";
import { Drawer } from "components/Drawer";
import UserSubscriptionsSideBar from "./SideBar";
import { useGetQuery } from "hooks/useQueryHooks";

interface Props {}

export default function UserSubscriptions({}: Props) {
  const [subscription, setSubscription] = useState<any>();

  const { id } = useParams();

  // get active user data ===============>
  const userURL = `/users/${id}`;

  const { data: user = [] }: UseQueryResult<any> = useGetQuery(
    userURL,
    userURL,
    {
      select: ({ data }: { data: { data: [] } }) => data.data,
    }
  );

  // get subscriptions list ======================>
  const url = `/user-subscriptions?user_id=${id}`;

  const { data: subscriptions = [], isLoading }: UseQueryResult<any> =
    useGetQuery(url, url, {
      select: ({ data }: { data: { data: [] } }) => data.data,
    });

  const onRowClick = (e: any) => {
    setSubscription(e.original);
    document.getElementById("add-new-subscription")?.click();
  };

  const columns = React.useMemo(() => {
    const coreColumns = [
      {
        Header: "الإشتراك",
        Cell: ({ row }: { row: Row<any> }) => {
          return (
            <div className="flex items-center gap-4">
              <div className="avatar indicator">
                <div className="w-12 h-12 rounded-full">
                  <img
                    src={row.original.image || "/images/img_rectangle347.png"}
                  />
                </div>
              </div>
              {row.original.name}
            </div>
          );
        },
      },

      {
        Header: "تاريخ البدء",
        Cell: ({ row }: { row: Row<any> }) => {
          return (
            <span className="flex items-center gap-4">
              {row.original.start_date}
            </span>
          );
        },
      },

      {
        Header: "تاريخ الإنتهاء",
        Cell: ({ row }: { row: Row<any> }) => {
          return (
            <span className="flex items-center gap-4">
              {row.original.expire_date}
            </span>
          );
        },
      },
      {
        Header: "حالة الإشتراك",
        Cell: ({ row }: { row: Row<any> }) => {
          return <span>{row.original.status}</span>;
        },
      },
    ];

    const isCurrentSubscription = subscriptions.current?.id !== undefined;

    return isCurrentSubscription
      ? [
          ...coreColumns,
          {
            id: "current subscription",
            Cell: ({ row }: { row: Row<any> }) => {
              return (
                <>
                  {row.original.id === subscriptions.current?.id && (
                    <Img src="/images/img_checkmark.svg" />
                  )}
                </>
              );
            },
          },
        ]
      : coreColumns;
  }, [subscriptions]);

  return (
    <div className="w-full space-y-4">
      <div className="w-fit">
        <Text as="h5" className="font-bold">
          {subscriptions?.current?.name}
        </Text>
        <Text as="h5" className="font-bold my-4">
          {user?.name}
        </Text>
        <Text as="h5" className="font-bold my-4">
          {user?.email}
        </Text>
        <Text as="h5" className="font-bold">
          {user?.phone}
        </Text>
      </div>

      {!isLoading ? (
        subscriptions?.subscriptions?.length !== 0 ? (
          <Table
            data={subscriptions?.subscriptions ?? []}
            columns={columns}
            modalTitle="اضافة إشتراك"
            modalContent={<AddUserSubscription />}
            rowOnClick={onRowClick}
            id="add-user-subscription"
          />
        ) : (
          <div
            className="flex justify-center"
            onClick={() =>
              document.getElementById("add-user-subscription")?.click()
            }
          >
            <Button secondaryBorder>إضافة إشتراك</Button>
          </div>
        )
      ) : (
        <>loading...</>
      )}

      <Drawer>
        <UserSubscriptionsSideBar
          userData={user ?? {}}
          subscriptionData={subscription ?? {}}
        />
      </Drawer>

      <Modal id="add-user-subscription">
        <AddUserSubscription />
      </Modal>
    </div>
  );
}
