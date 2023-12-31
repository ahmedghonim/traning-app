import { Button, Table } from "components";
import React, { useState } from "react";
import { Drawer } from "components/Drawer";
import { Row } from "react-table";
import SideBar from "./components/SideBar";
import { useGetQuery } from "hooks/useQueryHooks";
import { UseQueryResult } from "react-query";

function Cardio() {
  const [cardioData, setCardioData] = useState<any>(null);

  // get cards data =================>
  const url = "/cardios";

  const { data: cardioList, isLoading }: UseQueryResult<any> = useGetQuery(
    url,
    url,
    {
      select: ({ data }: { data: { data: [] } }) => data.data,
    }
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "الإسم",
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
        Header: "التمارين",
        accessor: "cardios",
        Cell: ({ row }: { row: Row<any> }) => {
          return (
            <div className="flex items-center gap-4">
              {row.original.cardios?.map(
                ({ name }: { name: string }) => ` ${name} `
              )}
            </div>
          );
        },
      },
    ],
    []
  );

  const rowOnClick = (
    e: React.MouseEvent<HTMLTableRowElement, MouseEvent> | any
  ) => {
    const formattedCardioData = e.original.cardios?.map((cardio: any) => ({
      ...cardio,
      is_new: 0,
    }));

    setCardioData({ ...e.original, cardios: formattedCardioData });
  };

  if (isLoading) {
    return <>loading...</>;
  }

  return (
    <>
      <div className="w-full space-y-4">
        <Table
          data={cardioList ?? []}
          columns={columns}
          rowOnClick={rowOnClick}
          opnSideBar="اضافة"
          opnSideBarOpen={() => setCardioData(null)}
        />
        {cardioList.length === 0 && (
          <div className="flex justify-center items-center h-96">
            <Button
              className="bg-primary text-white"
              htmlFor="my-drawer"
              secondaryBorder
            >
              اضافة
            </Button>
          </div>
        )}
        <Drawer>
          <SideBar cardioData={cardioData} setCardioData={setCardioData} />
        </Drawer>
      </div>
    </>
  );
}

export default Cardio;
