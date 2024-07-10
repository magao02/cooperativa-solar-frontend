import React, { useEffect, useMemo, useState } from "react";
import {Chip} from "@nextui-org/react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  getKeyValue,
  Pagination,
  Button,
  useDisclosure,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,

  
} from "@nextui-org/react";
import {Input} from "@nextui-org/react";
import {
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter
} from "@nextui-org/react";
import {Select, SelectItem} from "@nextui-org/react";
import {DatePicker} from "@nextui-org/date-picker";
import {Card, CardBody} from "@nextui-org/react";
import { FaPlus } from "react-icons/fa6";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaChevronDown } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import Link from "next/link";
//Interfaces
interface UserColumn {
  key: string;
  label: string;

}
interface UserInterface {
  id: number;
  mes: string;
  status: string;
  vencimento: String,
  valor: String,
 
}



const usersReq = [
  {
      id: 1,
      mes: "Jan/2023",
      status: "Paga",
      vencimento: "12/01/2023",
      valor: "R$150,00"

  },
  {
    id: 2,
    mes: "Jan/2023",
    status: "Pendente",
    vencimento: "12/01/2023",
    valor: "R$150,00"

  },
  {
    id: 3,
    mes: "Jan/2023",
    status: "Atrasada",
    vencimento: "12/01/2023",
    valor: "R$150,00"

  },
  {
    id: 4,
    mes: "Jan/2023",
    status: "Paga",
    vencimento: "12/01/2023",
    valor: "R$150,00"

  },
  {
    id: 5,
    mes: "Jan/2023",
    status: "Paga",
    vencimento: "12/01/2023",
    valor: "R$150,00"

  },
 
];
const columns = [
  {
    key: "mes",
    label: "Mês",
  },
  {
    key: "status",
    label: "status",
  },
  
  {
    key: "vencimento",
    label: "vencimento",
  },
  
  {
    key: "valor",
    label: "valor",
  },
  
  {
    key: "actions",
    label: "Ações",
  }
];

const INITIAL_VISIBLE_COLUMNS = ["mes", "status", "vencimento", "valor","actions"];
function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
const plans =[
  {
    value : 1,
    label : "mensal"
  },
  {
    value : 3,
    label : "trimestral"
  },
  {
    value : 12,
    label : "Anual"
  },

]

const tarifas =[
  {
    value : "B1",
    label : "Residencial normal"
  },
  {
    value : "B2",
    label : "Rural"
  },
  {
    value : "B3",
    label : "Comercial/Industrial"
  },
  {
    value : "B4",
    label : "Iluminação pública"
  },

]
export default function App() {
  const [users, setUsers] = useState<UserInterface[]>(usersReq);
  const [filterValue, setFilterValue] = React.useState("");
  const [page, setPage] = useState(1);
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [scrollBehavior, setScrollBehavior] = React.useState("inside");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "name",
    direction: "ascending",
  });
  const hasSearchFilter = Boolean(filterValue);
  
  
  const headerColumns = React.useMemo(() => {
    return columns.filter((column) => Array.from(visibleColumns).includes(column.key));
  }, [visibleColumns]);


  const CadastrarUsuário  = ()=>{
    //$aact_YTU5YTE0M2M2N2I4MTliNzk0YTI5N2U5MzdjNWZmNDQ6OjAwMDAwMDAwMDAwMDAwODIyOTI6OiRhYWNoXzNmNTM4NTA2LTJjMzYtNGE3ZS1iMTE5LWY5Zjk0YTE1MjU0NA==
    const novaFatura: UserInterface = {
      id: users.length + 1,
      mes: "Jun/2024",
      status: "Pendente",
      vencimento: "23/06/2023",
      valor: "R$257,00"
    }
    setUsers([...users, novaFatura]);
    onOpenChange()
    console.log("Cadastrado")
  }
  

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);
  
  
  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...users];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((usina) =>
        usina.mes.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    return filteredUsers;
  }, [users, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);
  
  
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);
  
  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const onSearchChange = React.useCallback((value: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(()=>{
    setFilterValue("")
    setPage(1)
  },[])
  const eixe = ()=>{
    window.open("https://sandbox.asaas.com/i/xjqzrztvorvhdb55", "_blank");
  }
  const renderCell = React.useCallback((usina: UserInterface, columnKey:string) => {
    const cellValue = getKeyValue(usina, columnKey);

    switch (columnKey) {
      case "nome":
        return(
          <Link href="usina/1">
            <div className="flex flex r items-center gap-2">
              <p className="text-bold text-small capitalize">{cellValue}</p>
            </div>
          </Link>
        )
        case "status":
          switch(cellValue){
            case "Paga":
              return <Chip color="success" variant="flat" >{cellValue}</Chip>
            case "Pendente":
              return <Chip color="warning"  onClick={eixe} variant="flat" >{cellValue}</Chip>
            case "Atrasada":
              return <Chip color="danger"  onClick={eixe} variant="flat" >{cellValue}</Chip>
          }
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="md" variant="light">
                  <IoEllipsisVertical color="primary" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem>Editar</DropdownItem>
                <DropdownItem>Apagar</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return <div className="flex flex r items-center gap-2">
        <p className="text-bold text-small capitalize">{cellValue}</p>
      </div>
    }
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex w-full flex-col  pt-10 px-10 gap-4">
        <div className="flex justify-between gap-3 items-end">
        <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Procura pelo Nome..."
            startContent={<FaSearch  />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          
          <div className="flex gap-3">
            
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button size="lg" endContent={<FaChevronDown className="text-small" />} variant="flat">
                  Colunas
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.key} className="capitalize">
                    {capitalize(column.label)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button color="primary" onPress={onOpen} size="lg"   endContent={<FaPlus color="primary"/>}>
            Lançar fatura
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-600 ">Total {users.length} de faturas</span>
          <label className="flex items-center text-default-600 ">
           Linhas por página
            <select
              className="bg-transparent outline-none text-default-600 "
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
        
      </div>
    );
  }, [
    filterValue,
    visibleColumns,
    onRowsPerPageChange,
    
  ]);


  return (
    <>

      
    <Table className="px-10" aria-label="tablea de usuarios"
    topContent={topContent}
    topContentPlacement="outside"
    sortDescriptor={sortDescriptor}
    onSortChange={setSortDescriptor}
     bottomContent={
      <div className="flex w-full justify-center">
        
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={(page) => setPage(page)}
        />
      </div>
    } >
      <TableHeader columns={headerColumns}>
        {(column: UserColumn) => <TableColumn className="tableColumnTitle  justify-center" key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody emptyContent={"Nenhum Usina encontrada."} items={sortedItems}>
        {(item: UserInterface) => (
          <TableRow key={item.id}>
            {(columnKey: any) => <TableCell >{renderCell(item,columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
      
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        placement="top-center"
        scrollBehavior={scrollBehavior}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Cadastrar Fatura</ModalHeader>
              <ModalBody>
                
               <DatePicker label="Data Vencimento" />
               <Input autoFocus label="Valor" variant="bordered" />
              </ModalBody>
              <ModalFooter>
              
                <Button color="primary" onPress={CadastrarUsuário}>
                  Cadastrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>


    </>
  );
}
