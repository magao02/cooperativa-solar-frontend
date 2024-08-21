import React, { useCallback, useEffect, useState } from "react";
import { Chip } from "@nextui-org/react";
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
import { Input } from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "@nextui-org/react";
import { DatePicker } from "@nextui-org/date-picker";
import { FaPlus } from "react-icons/fa6";
import { FaChevronDown } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/router";
import { createFatura, getUsersData } from "../../services/api-usuario";
//Interfaces
interface UserColumn {
  key: string;
  label: string;

}
interface UserInterface {
  id: number;
  mesReferencia: string;
  anoReferencia: string;
  status: string;
  dataVencimento: String,
  valor: number,
  consumo: number;
}

const columns = [
  {
    key: "mesReferencia",
    label: "Mês",
  },
  {
    key: "anoReferencia",
    label: "Ano",
  },
  {
    key: "status",
    label: "status",
  },

  {
    key: "dataVencimento",
    label: "vencimento",
  },

  {
    key: "consumo",
    label: "consumo",
  },

  {
    key: "valor",
    label: "valor",
  },
];

const INITIAL_VISIBLE_COLUMNS = ["mesReferencia", "anoReferencia", "status", "dataVencimento", "valor", "consumo"];
function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function App() {
  const [users, setUsers] = useState<UserInterface[]>([]);
  const [filterValue, setFilterValue] = React.useState("");
  const [page, setPage] = useState(1);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [scrollBehavior, setScrollBehavior] = React.useState<"inside" | "outside" | "normal">("inside");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [dataVencimento, setDataVencimento] = useState("");
  const [mesReferencia, setMesReferencia] = useState("");
  const [anoReferencia, setAnoReferencia] = useState("");
  const [consumo, setConsumo] = useState<number | null>(null);
  const router = useRouter();
  const { id } = router.query;
  type SortDirection = 'ascending' | 'descending';

  type SortDescriptor = {
    column: string;
    direction: SortDirection;
  };

  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });

  const handleSortChange = (descriptor: SortDescriptor) => {
    setSortDescriptor({
      column: descriptor.column || 'name', // Valor padrão se undefined
      direction: descriptor.direction || 'ascending', // Valor padrão se undefined
    });
  };
  const hasSearchFilter = Boolean(filterValue);

  const handleValueChange = (value: string) => {
    const numericValue = value ? parseFloat(value) : null;
    setConsumo(numericValue);
  };


  const headerColumns = React.useMemo(() => {
    return columns.filter((column) => Array.from(visibleColumns).includes(column.key));
  }, [visibleColumns]);


  const CadastrarUsuário = async () => {
    const idString = typeof id === 'string' ? id : '';
    const numericId = parseInt(idString, 10);
  
    // Define um valor padrão para consumo se for null
    const consumoValue = consumo !== null ? consumo : 0; // Use um valor padrão apropriado para o seu caso
  
    const faturaBody = {
      usuario: numericId,
      dataVencimento: dataVencimento,
      mesReferencia: mesReferencia,
      anoReferencia: anoReferencia,
      consumo: consumoValue,
    };
  
    try {
      const data = await createFatura(faturaBody);
      fetchUserData();
      onOpenChange();
    } catch (error) {
      console.log("Erro ao cadastrar fatura", error);
      console.log(faturaBody);
    }
  };

  const fetchUserData = useCallback(async () => {
    try {
      const idString = typeof id === 'string' ? id : '';
      const numericId = parseInt(idString, 10);
      const userData = await getUsersData(numericId);
      setUsers(userData || []);
      console.log(userData);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);


  const onRowsPerPageChange = React.useCallback((e: any) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);


  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...users];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((usina) =>
        usina.mesReferencia.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    return filteredUsers;
  }, [users, filterValue, hasSearchFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);


  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = (a as any)[sortDescriptor.column];
      const second = (b as any)[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const handleSelectionChange = (keys: any) => {
    setVisibleColumns(new Set(keys));
  };

  const onSearchChange = React.useCallback((value: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("")
    setPage(1)
  }, [])
  const eixe = () => {
    window.open("https://sandbox.asaas.com/i/xjqzrztvorvhdb55", "_blank");
  }
  const renderCell = React.useCallback((usina: UserInterface, columnKey: string) => {
    const cellValue = getKeyValue(usina, columnKey);

    switch (columnKey) {
      case "nome":
        return (
          <Link href="usina/1">
            <div className="flex r items-center gap-2">
              <p className="text-bold text-small capitalize">{cellValue}</p>
            </div>
          </Link>
        )
      case "status":
        switch (cellValue) {
          case "Paga":
            return <Chip color="success" variant="flat" >{cellValue}</Chip>
          case "Pendente":
            return <Chip color="warning" onClick={eixe} variant="flat" >{cellValue}</Chip>
          case "Atrasada":
            return <Chip color="danger" onClick={eixe} variant="flat" >{cellValue}</Chip>
        }
      default:
        return <div className="flex  r items-center gap-2">
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
            startContent={<FaSearch />}
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
                onSelectionChange={handleSelectionChange}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.key} className="capitalize">
                    {capitalize(column.label)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button color="primary" onPress={onOpen} size="lg" endContent={<FaPlus color="primary" />}>
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
    onClear,
    onOpen,
    onSearchChange,
    users.length
  ]);


  return (
    <>


      <Table className="px-10" aria-label="tablea de usuarios"
        topContent={topContent}
        topContentPlacement="outside"
        sortDescriptor={sortDescriptor}
        onSortChange={handleSelectionChange}
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
        <TableBody emptyContent={"Nenhum Fatura encontrada."} items={sortedItems}>
          {(item: UserInterface) => (
            <TableRow key={item.id}>
              {(columnKey: any) => <TableCell >{renderCell(item, columnKey)}</TableCell>}
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

                <DatePicker label="Data Vencimento" onChange={(e) => { setDataVencimento(e.toString()) }} />
                <Input autoFocus label="Mês de Referência. Ex.: 01" variant="bordered" onValueChange={setMesReferencia} />
                <Input autoFocus label="Ano de Referência. Ex.: 2024" variant="bordered" onValueChange={setAnoReferencia} />
                <Input autoFocus label="Consumo. Ex.: 100" variant="bordered" onValueChange={handleValueChange} />
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
