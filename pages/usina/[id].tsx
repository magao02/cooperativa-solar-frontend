import React, { useEffect, useMemo, useState } from "react";
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
  nome: string;
  estado: string;
  cpf: String,
  email: String,
  uc: String,
  planoAdesao:  String,
  consumoMedio: number,
}



const usersReq = [
  {
      id: 1,
      nome: "Lucas Carvalho",
      estado: "SP",
      cpf: "123.456.789-00",
      email: "teste@gmail.com",
      uc: "123456789",
      planoAdesao: "Plano A",
      consumoMedio: 300,

  },
  {
    id: 2,
    nome: "Lucas Carvalho",
    estado: "SP",
    cpf: "123.456.789-00",
    email: "teste@gmail.com",
    uc: "123456789",
    planoAdesao: "Plano A",
    consumoMedio: 300,

  },
  {
    id: 3,
    nome: "Lucas Carvalho",
    estado: "SP",
    cpf: "123.456.789-00",
    email: "teste@gmail.com",
    uc: "123456789",
    planoAdesao: "Plano A",
    consumoMedio: 300,

  },
  {
    id: 4,
    nome: "Lucas Carvalho",
    estado: "SP",
    cpf: "123.456.789-00",
    email: "teste@gmail.com",
    uc: "123456789",
    planoAdesao: "Plano A",
    consumoMedio: 300,

  },
  {
    id: 5,
    nome: "Lucas Carvalho",
    estado: "SP",
    cpf: "123.456.789-00",
    email: "teste@gmail.com",
    uc: "123456789",
    planoAdesao: "Plano A",
    consumoMedio: 300,

  },
  {
    id: 6,
    nome: "Lucas Carvalho",
    estado: "SP",
    cpf: "123.456.789-00",
    email: "teste@gmail.com",
    uc: "123456789",
    planoAdesao: "Plano A",
    consumoMedio: 300,

  },
 
];
const columns = [
  {
    key: "uc",
    label: "UC",
  },
  {
    key: "nome",
    label: "Nome",
  },
  
  {
    key: "cpf",
    label: "CPF",
  },
  
  {
    key: "planoAdesao",
    label: "Plano de Adesão",
  },
  {
    key: "consumoMedio",
    label: "Consumo Médio",
  },
  {
    key: "estado",
    label: "Estado",
  },
  
  {
    key: "actions",
    label: "Ações",
  }
];

const INITIAL_VISIBLE_COLUMNS = ["uc","nome", "cpf", "consumoMedio","planoAdesao", "capacidadeClientes", "capacidadeGeracao","estado","actions"];
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


  const CadastrarUsuário = ()=>{
    const usuario = {
      id: users.length + 1,
      nome: "Usina Solar C",
      estado: "SP",
      cpf: "123.456.789-00",
      email: "teste@gmail.com",
      uc: "123456789",
      planoAdesao: "Plano A",
      consumoMedio: 300,
    }
    setUsers([...users, usuario])
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
        usina.nome.toLowerCase().includes(filterValue.toLowerCase()),
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
            Cadastrar usuário
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-600 ">Total {users.length} usuários na usina</span>
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
        <div className="flex justify-center items-center gap-3"> 
      <Card>
        <CardBody className="px-8 py-5">
          <h3 className="text-xl max-w-25  text-center">Capacidade</h3>
          <h3  className="text-xl max-w-26  text-center"> de Geração</h3>
          <p className=" text-center text-4xl font-semibold !important">2000kw</p>
        </CardBody>
      </Card>
      <Card>
        <CardBody className="px-8 py-5">
          <h3 className="text-xl  text-center">Em uso</h3>
          <h3  className="text-xl max-w-26  text-center"> por clientes</h3>
          <h2 className=" text-center text-4xl font-semibold !important">1500kw</h2>
        </CardBody>
      </Card>
      <Card >
        <CardBody className="px-8 py-5">
          <h3  className="text-xl max-w-26   text-center">Disponível para </h3>
          <h3  className="text-xl max-w-26    text-center"> novos usuários</h3>
          <h2 className=" text-center text-4xl   font-semibold !important">500kw</h2>
        </CardBody>
      </Card>
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
        {(item: Usina) => (
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
              <ModalHeader className="flex flex-col gap-1">Cadastrar cliente</ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                 
                  label="Nome"
                  placeholder=""
                  variant="bordered"
                />
                <Input
                  autoFocus
                 
                  label="Endereço"

                  variant="bordered"
                />
               <DatePicker label="Data Nascimento" />
               <Input autoFocus label="CPF/CNPJ" variant="bordered" />
                <Input autoFocus label="Email" variant="bordered" />
                <Input autoFocus label="UC" variant="bordered" />
                <Input autoFocus label="Consumo Médio" variant="bordered" />
                <Select
                items={plans}
                label="Plano de adesão"
                placeholder="Selecione um plano"
  
              >
                {(plan) => <SelectItem key={plan.value}>{plan.label}</SelectItem>}
              </Select>

              <Select
                items={tarifas}
                label="Tarifa"
                placeholder="Selecione uma tarifa"
  
              >
                {(tarifa) => <SelectItem key={tarifa.value}>{tarifa.label}</SelectItem>}
              </Select>
                
                
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
