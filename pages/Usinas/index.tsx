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
  Chip,
  User,

} from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "@nextui-org/react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { Spinner } from "@nextui-org/spinner";
import { FaPlus } from "react-icons/fa6";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaChevronDown } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import Link from "next/link";
//Interfaces
interface UsinaColumn {
  key: string;
  label: string;

}
interface Usina {
  id: number;
  nome: string;
  estado: string;
  potencialInstalada: number;
  potenciaNominal: number;
  capacidadeGeracao: number;
  consumoMedioClientes: number;
  capacidadeClientes: number;
  numeroClientes: number;
  vagasClientes: number;
}

interface User {
  id: number;
  nome: string;
  cpf: string;
}


const columns = [
  {
    key: "nome",
    label: "Nome",
  },
  {
    key: "localizacao",
    label: "Estado",
  },
  {
    key: "potenciaInstalada",
    label: "Potência Instalada (kwp)",
  },
  {
    key: "potenciaNominal",
    label: "Potência Nominal (kw)",
  },
  {
    key: "capacidadeGeracao",
    label: "Capacidade de Geração",
  },
  {
    key: "consumoMedioClientes",
    label: "Consumo Médio Clientes",
  },
  {
    key: "capacidadeClientes",
    label: "Capacidade Clientes",
  },
  {
    key: "numeroClientes",
    label: "Número de Clientes",
  },
  {
    key: "vagasClientes",
    label: "Vagas dos Clientes",
  },
  {
    key: "actions",
    label: "Ações",
  }
];


const INITIAL_VISIBLE_COLUMNS = ["nome", "localizacao", "potenciaInstalada", "numeroClientes", "capacidadeClientes", "capacidadeGeracao", "actions"];
function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function App() {
  const [usinas, setUsinas] = useState<Usina[]>([]);
  const [filterValue, setFilterValue] = React.useState("");
  const [page, setPage] = useState(1);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [nomeUsina, setNomeUsina] = useState("")
  const [estadoUsina, setEstadoUsina] = useState("")
  const [potenciaInstaladaUsina, setPotenciaInstaladaUsina] = useState("")
  const [potenciaNominalUsina, setPotenciaNominalUsina] = useState("")
  const [capacidadeGeracaoUsina, setCapacidadeGeracaoUsina] = useState("")
  const [animacaoCadastro, setAnimacaoCadastro] = useState("")
  const [selectedResponsavelUserId, setSelectedResponsavelUserId] = useState(null);


  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "name",
    direction: "ascending",
  });

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`);
      if (!response.ok) {
        throw new Error('error fetching users');
      }
      const resultUsers = await response.json();
      setUsers(resultUsers || [])
    } catch (error) {
      console.log("erro ao buscar usuários", error)
    }
  }

  const fetchDataUsinas = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usinas`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      console.log("USINAS", result);
      setUsinas(result || []);
    } catch (error) {
      console.error('Failed to fetch usinas:', error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const hasSearchFilter = Boolean(filterValue);
  useEffect(() => {
    // Função assíncrona para buscar dados

    fetchUserData();
    fetchDataUsinas();
  }, []);



  const headerColumns = React.useMemo(() => {
    return columns.filter((column) => Array.from(visibleColumns).includes(column.key));
  }, [visibleColumns]);

  const handleResponsavelUserSelect = (user: any) => {
    setSelectedResponsavelUserId(user);
  };

  const CadastrarUsina = async () => {
    setAnimacaoCadastro("loading");

    const usina = {
      usuarioResponsavel: selectedResponsavelUserId,
      nome: nomeUsina,
      localizacao: estadoUsina,
      potenciaInstalada: parseInt(potenciaInstaladaUsina),
      potenciaNominal: parseInt(potenciaNominalUsina),
      capacidadeGeracao: parseInt(capacidadeGeracaoUsina),
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usinas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(usina)
      });

      const data = await response.json();

      if (response.status === 201) {
        console.log('Usina cadastrada com sucesso:', data);
        setAnimacaoCadastro("success");
        fetchDataUsinas();
        limparFormulario();

        setTimeout(() => {
          onOpenChange();
          setAnimacaoCadastro("");
        }, 1000);
      } else {
        console.log(usina.usuarioResponsavel)
        console.error('Erro ao cadastrar usina:', data);
        setAnimacaoCadastro("error");
        setTimeout(() => {
          setAnimacaoCadastro("");
        }, 1000);
      }
    } catch (error) {
      console.error('Erro ao realizar requisição:', error);
      setAnimacaoCadastro("error");
      setTimeout(() => {
        setAnimacaoCadastro("");
      }, 1000);
    }
  };

  const limparFormulario = () => {
    setNomeUsina("");
    setEstadoUsina("");
    setPotenciaInstaladaUsina("");
    setPotenciaNominalUsina("");
    setCapacidadeGeracaoUsina("");
  }
  const onRowsPerPageChange = React.useCallback((e: any) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);


  const filteredItems = useMemo(() => {
    let filteredUsinas = Array.isArray(usinas) ? [...usinas] : [];
    if (hasSearchFilter) {
      filteredUsinas = filteredUsinas.filter((usina) =>
        usina.nome.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    return filteredUsinas;
  }, [usinas, filterValue]);


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

  const onSearchChange = React.useCallback((value: string | number) => {
    if (value) {
      setFilterValue(String(value));
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("")
    setPage(1)
  }, [])

  const renderCell = React.useCallback((usina: Usina, columnKey: string) => {
    const cellValue = getKeyValue(usina, columnKey);

    switch (columnKey) {
      case "nome":
        return (
          <Link href={`usina/${usina.id}`}>
            <div className="flex items-center gap-2">
              <p className="text-bold text-small capitalize">{cellValue}</p>
            </div>
          </Link>
        );
      case "actions":
        return (
          <div className="flex items-center gap-2">
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
        return (
          <div className="flex items-center gap-2">
            <p className="text-bold text-small capitalize">{cellValue}</p>
          </div>
        );
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
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.key} className="capitalize">
                    {capitalize(column.label)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button color="primary" onPress={onOpen} size="lg" endContent={<FaPlus color="primary" />}>
              Cadastrar usina
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-600 ">Total {usinas.length} usinas</span>
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
  const retornaAnimacaoCadastro = () => {
    switch (animacaoCadastro) {
      case "loading":
        return (
          <ModalBody>
            <Spinner label="cadastrando usina" size="lg" />
          </ModalBody>
        )

      case "success":
        return (
          <ModalBody>
            <p>Usina cadastrada com sucesso!</p>
          </ModalBody>
        )

      case "error":
        return (
          <ModalBody>
            <p>Ocorreu um erro ao cadastrar a usina!</p>
          </ModalBody>
        )
      default:
        return ("")
    }
  }

  if (loading) {
    return <Spinner size="lg" />;
  }
  return (
    <>

      <Table className="px-10" aria-label="tablea de usinas"
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
          {(column: UsinaColumn) => <TableColumn className="tableColumnTitle  justify-center" key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody emptyContent={loading ? <Spinner label="Carregando..." /> : "Nenhuma usina encontrada"}>
          {sortedItems.map((usina) => (
            <TableRow key={usina.id}>
              {(columnKey) => <TableCell>{renderCell(usina, columnKey)}</TableCell>}
            </TableRow>
          ))}
        </TableBody>

      </Table>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Cadastrar Usina</ModalHeader>
              {animacaoCadastro == "" ? (
                <>
                  <ModalBody>

                    <Input
                      autoFocus
                      isRequired
                      label="Nome"
                      placeholder=""
                      variant="bordered"
                      value={nomeUsina}
                      onValueChange={setNomeUsina}


                    />
                    <Input
                      autoFocus
                      isRequired
                      label="Estado"
                      value={estadoUsina}
                      onValueChange={setEstadoUsina}


                      variant="bordered"
                    />
                    <Input
                      autoFocus
                      isRequired
                      label="Potência Instalada"
                      variant="bordered"

                      value={potenciaInstaladaUsina}

                      onValueChange={setPotenciaInstaladaUsina}
                    />
                    <Input
                      autoFocus
                      isRequired
                      value={potenciaNominalUsina}
                      onValueChange={setPotenciaNominalUsina}

                      type="number"
                      label="Potencia Nominal"
                      variant="bordered"
                    />
                    <Input
                      autoFocus
                      isRequired
                      label="Capacidade de Geração"
                      value={capacidadeGeracaoUsina}
                      onValueChange={setCapacidadeGeracaoUsina}
                      variant="bordered"
                    />
                    <Autocomplete
                      label="Responsável pela usina"
                      defaultItems={users}
                    >
                      {(item) => (
                        <AutocompleteItem
                          key={item.id}
                          onClick={() => handleResponsavelUserSelect(item.id)}
                        >
                          {item.nome}
                        </AutocompleteItem>
                      )}
                    </Autocomplete>

                  </ModalBody>
                  <ModalFooter>

                    <Button type="submit" color="primary" onPress={CadastrarUsina}>
                      Cadastrar
                    </Button>
                  </ModalFooter>
                </>
              ) : retornaAnimacaoCadastro()}

            </>
          )}
        </ModalContent>
      </Modal>


    </>
  );
}
