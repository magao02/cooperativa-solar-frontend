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
  Spinner,
  CalendarDate,


} from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";
import { DatePicker } from "@nextui-org/date-picker";
import { FaPlus } from "react-icons/fa6";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaChevronDown } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import Link from "next/link";
import { createUser, getAllUsersData } from "../../services/api-usuarios/api";
import { toast } from "sonner";
//Interfaces
interface UserColumn {
  key: string;
  label: string;

}
interface UserInterface {
  id: number;
  nome: string;
  endereco: string;
  cpf: String,
  email: String,
  uc: String,
  plano: String,
  consumoMedio: number,
  tipoConta: String,
}

const columns = [
  {
    key: "tipoConta",
    label: "Tipo de Conta",

  },
  {
    key: "uc",
    label: "UC",
  },
  {
    key: "nome",
    label: "Nome",
  },

  {
    key: "cpfcnpj",
    label: "CPF/CNPJ",
  },

  {
    key: "plano",
    label: "Plano de Adesão",
  },
  {
    key: "consumoMedio",
    label: "Consumo Médio",
  },
  {
    key: "endereco",
    label: "Endereço",
  },

  {
    key: "actions",
    label: "Ações",
  }
];

const INITIAL_VISIBLE_COLUMNS = ["tipoConta", "uc", "nome", "cpfcnpj", "plano", "consumoMedio", "capacidadeClientes", "capacidadeGeracao", "endereco", "actions"];
function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
const plans = [
  {
    value: 1,
    label: "mensal"
  },
  {
    value: 3,
    label: "trimestral"
  },
  {
    value: 12,
    label: "Anual"
  },

]
const tiposUsuario = [
  {
    value: "Admin",
    label: "Administrador"
  },
  {
    value: "Gestor",
    label: "Gestor Usina"
  },
  {
    value: "Cliente",
    label: "Cliente"
  },

]

const tarifas = [
  {
    value: "B1",
    label: "Residencial normal"
  },
  {
    value: "B2",
    label: "Rural"
  },
  {
    value: "B3",
    label: "Comercial/Industrial"
  },
  {
    value: "B4",
    label: "Iluminação pública"
  },

]
export default function App() {
  const [users, setUsers] = useState<UserInterface[]>([]);
  const [filterValue, setFilterValue] = React.useState("");
  const [page, setPage] = useState(1);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false)
  const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [scrollBehavior, setScrollBehavior] = React.useState<"inside" | "outside" | "normal">("inside");

  const [filtroTipo, setFiltroTipo] = React.useState('');
  const setTipoFilter = (e: any) => {
      const tipo = e.target.value;

      setFiltroTipo(tipo);
  };

  const hasTipoFilter = Boolean(filtroTipo);

  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [tipoUsuario, setTipoUsuario] = useState(null);
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
  const [nomeCadastro, setNomeCadastro] = useState("");
  const [emailCadastro, setEmailCadastro] = useState("");
  const [telefoneCadastro, setTelefoneCadastro] = useState("");
  const [dataNascimentoCadastro, setDataNascimentoCadastro] = useState<any>(null);
  const [cpfcnpjCadastro, setCpfcnpjCadastro] = useState("");
  const [ucCadastro, setUcCadastro] = useState("");
  const [enderecoCadastro, setEnderecoCadastro] = useState("");
  const [consumoMedioCadastro, setConsumoMedioCadastro] = useState("");
  const [usinaCadastro, setUsinaCadastro] = useState("");
  const [planoCadastro, setPlanoCadastro] = useState("");
  const [tarifaCadastro, setTarifaCadastro] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);

  const hasSearchFilter = Boolean(filterValue);

  const openDeleteConfirmationModal = () => {
    setConfirmDeleteModalOpen(true);
  };

  const closeDeleteConfirmationModal = () => {
    setConfirmDeleteModalOpen(false);
  };

  const fetchUserData = async () => {
    try {
      const userData = await getAllUsersData();
      setUsers(userData || []);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  }

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleTipoUsuarioChange = (value: any) => {
    setTipoUsuario(value.target.value);
  };
  const handleTarifaChange = (value: any) => {
    setTarifaCadastro(value.target.value);
  };

  const handlePlanoChange = (value: any) => {
    setPlanoCadastro(value.target.value);
  };

  const planoMapping: { [key: number]: string } = {
    1: 'mensal',
    3: 'trimestral',
    12: 'anual'
  };

  const CadastrarUsuario = async () => {
    const planoMapped = planoMapping[parseInt(planoCadastro)];

    const userBody: any = {
      nome: nomeCadastro,
      email: emailCadastro,
      tipoConta: tipoUsuario,
      data_nascimento: dataNascimentoCadastro,
      cpfcnpj: cpfcnpjCadastro,
      telefone: telefoneCadastro,
    };

    if (tipoUsuario == "Cliente") {
      userBody['endereco'] = enderecoCadastro;
      userBody['consumoMedio'] = parseInt(consumoMedioCadastro);
      userBody['usina'] = parseInt(usinaCadastro);
      userBody['plano'] = planoMapped;
      userBody['tarifa'] = tarifaCadastro;
      userBody['uc'] = ucCadastro;
    };

    try {
      setLoading(true);
      const data = await createUser(userBody);
      console.log('Usuário cadastrado com sucesso', data);

      fetchUserData();
      onOpenChange()

      setNomeCadastro('');
      setEmailCadastro('');
      setEnderecoCadastro('');
      setTelefoneCadastro('');
      setDataNascimentoCadastro('');
      setCpfcnpjCadastro('');
      setUcCadastro('');
      setConsumoMedioCadastro('');
      setPlanoCadastro('');
      setTarifaCadastro('');
      setUsinaCadastro('');
    }
    catch (error) {
      toast.error("CPF/CNPJ tem que ser válido!")
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const headerColumns = React.useMemo(() => {
    return columns.filter((column) => Array.from(visibleColumns).includes(column.key));
  }, [visibleColumns]);

  const onRowsPerPageChange = React.useCallback((e: any) => {
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

    if (hasTipoFilter) {
      filteredUsers = filteredUsers.filter(
        users => users.tipoConta === filtroTipo,
      );
    }

    return filteredUsers;
  }, [users, filterValue, hasSearchFilter, hasTipoFilter, filtroTipo]);

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

  const handleSelectionChange = (keys: any) => {
    setVisibleColumns(new Set(keys));
  };


  const renderCell = React.useCallback((user: UserInterface, columnKey: string) => {
    const cellValue = getKeyValue(user, columnKey);

    switch (columnKey) {
      case "nome":
        return (
          <Link href={`usuario/${user.id}`}>
            <div className="flex r items-center gap-2">
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
                <DropdownItem onClick={() => {
                  setSelectedUserId(user.id);
                  openDeleteConfirmationModal();
                }}>Apagar</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return <div className="flex r items-center gap-2">
          <p className="text-bold text-small capitalize">{cellValue}</p>
        </div>
    }
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex w-full flex-col  pt-10 px-10 gap-4">
        <div className="flex justify-between gap-3 items-end">
          <div className="flex flex-initial gap-3 w-full">
            <Input
              isClearable
              className="w-full sm:max-w-[25%]"
              placeholder="Procura pelo Nome..."
              startContent={<FaSearch />}
              value={filterValue}
              onClear={() => onClear()}
              onValueChange={onSearchChange}
            />

            <Select
              className="sm:max-w-[20%]"
              label="Selecione o tipo"
              onChange={setTipoFilter}
            >
              <SelectItem key="Gestor">Gestor</SelectItem>
              <SelectItem key="Admin">Admin</SelectItem>
              <SelectItem key="Cliente">Cliente</SelectItem>
            </Select>
          </div>

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
              Cadastrar usuário
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-600 ">Total {users.length} usuários no sistema</span>
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


  if (loading) {
    return <Spinner size="lg" />;
  }

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
        <TableBody emptyContent={"Nenhum usuário encontrado."} items={sortedItems}>
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
              <ModalHeader className="flex flex-col gap-1">Cadastrar cliente</ModalHeader>
              <ModalBody>
                <Input
                  autoFocus

                  label="Nome"
                  placeholder=""
                  variant="bordered"
                  value={nomeCadastro}
                  onChange={(e) => setNomeCadastro(e.target.value)}
                />
                <Input
                  autoFocus
                  label="Telefone"
                  variant="bordered"
                  value={telefoneCadastro}
                  onChange={(e) => setTelefoneCadastro(e.target.value)} />

                <DatePicker label="Data Nascimento" onChange={(e) => { setDataNascimentoCadastro(e.toString()) }} />
                <Input autoFocus label="CPF/CNPJ" value={cpfcnpjCadastro} onChange={(e) => setCpfcnpjCadastro(e.target.value)} variant="bordered" />
                <Input autoFocus label="Email" value={emailCadastro} onChange={(e) => setEmailCadastro(e.target.value)} variant="bordered" />
                <Select
                  items={tiposUsuario}
                  label="Tipo de usuário"
                  onChange={handleTipoUsuarioChange}
                  placeholder="Selecione o tipo de usuário"

                >
                  {(tiposUsuario) => <SelectItem key={tiposUsuario.value}>{tiposUsuario.label}</SelectItem>}
                </Select>
                {tipoUsuario == "Cliente" && (
                  <>
                    <Input autoFocus label="Endereço" variant="bordered" onValueChange={setEnderecoCadastro}/>
                    <Input autoFocus label="UC" variant="bordered" onValueChange={setUcCadastro}/>
                    <Input autoFocus label="Consumo Médio" variant="bordered" onValueChange={setConsumoMedioCadastro}/>

                    <Select
                      items={plans}
                      onChange={handlePlanoChange}
                      label="Plano de adesão"
                      placeholder="Selecione um plano"
                    >
                      {(plan) => <SelectItem key={plan.value}>{plan.label}</SelectItem>}
                    </Select>


                    <Select
                      items={tarifas}
                      onChange={handleTarifaChange}
                      label="Tarifa"
                      placeholder="Selecione uma tarifa"

                    >
                      {(tarifa) => <SelectItem key={tarifa.value}>{tarifa.label}</SelectItem>}
                    </Select>
                  </>
                )}

              </ModalBody>
              <ModalFooter>

                <Button color="primary" onPress={CadastrarUsuario}>
                  {loading ? <Spinner size="sm" color="white" /> : 'Cadastrar'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>


    </>
  );
}
