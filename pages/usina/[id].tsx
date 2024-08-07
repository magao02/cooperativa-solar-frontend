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
import { Card, CardBody } from "@nextui-org/react";
import { FaPlus } from "react-icons/fa6";
import { FaChevronDown } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import Link from "next/link";
import { createUser, getUsinaById } from "../../services/api-usina";
import { useRouter } from "next/router";

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
  planoAdesao: String,
  consumoMedio: number,
}

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
    key: "cpfcnpj",
    label: "CPF/CNPJ",
  },
  {
    key: "tipoConta",
    label: "Tipo de Conta",
  },
  {
    key: "plano",
    label: "Plano de adesão",
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
    key: "email",
    label: "Email",
  },
  {
    key: "telefone",
    label: "Telefone",
  },
];

const INITIAL_VISIBLE_COLUMNS = ["uc", "nome", "cpfcnpj", "consumoMedio", "tipoConta", "plano", "endereco", "email", "telefone"];
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

interface UsinaData {
  id: number;
  nome: string;
  estado: string;
  potenciaInstalada: number;
  potenciaNominal: number;
  capacidadeGeracao: number;
  capacidadeEmUso: number;
  capacidadeDisponivel: number;
}

export default function App() {
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
  const [users, setUsers] = useState([]);
  const [filterValue, setFilterValue] = React.useState("");
  const [page, setPage] = useState(1);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [scrollBehavior, setScrollBehavior] = React.useState<"inside" | "outside" | "normal">("inside");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [loading, setLoading] = useState(false);
  const [dadosUsina, setDadosUsina] = useState<UsinaData | null>(null);
  const [capacidadeGeracao, setCapacidadeGeracao] = useState<number | null>(null);
  const [capacidadeEmUso, setCapacidadeEmUso] = useState<number | null>(null);
  const [capacidadeDisponivel, setCapacidadeDisponivel] = useState<number | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const idConvertedForNumber = (() => {
    if (Array.isArray(id)) {
      // Se id for um array, escolha o primeiro elemento ou trate conforme necessário
      return id.length > 0 ? parseInt(id[0], 10) : undefined;
    } else if (typeof id === 'string') {
      // Se id é uma string, converter diretamente
      return parseInt(id, 10);
    }
    return undefined;
  })();

  type SortDirection = 'ascending' | 'descending';

  type SortDescriptor = {
    column: string;
    direction: SortDirection;
  };

  const handleSortChange = (descriptor: SortDescriptor) => {
    setSortDescriptor({
      column: descriptor.column || 'name', // Valor padrão se undefined
      direction: descriptor.direction || 'ascending', // Valor padrão se undefined
    });
  };

  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });
  
  const hasSearchFilter = Boolean(filterValue);


  const headerColumns = React.useMemo(() => {
    return columns.filter((column) => Array.from(visibleColumns).includes(column.key));
  }, [visibleColumns]);

  const planoMapping: { [key: number]: string } = {
    1: 'mensal',
    3: 'trimestral',
    12: 'anual'
  };

  const fetchUsinaData = async (id: number) => {
    try {
      const usinaData = await getUsinaById(id);
      setUsers(usinaData.usuarios)
      setDadosUsina(usinaData);
      setCapacidadeGeracao(usinaData.capacidadeGeracao);
      setCapacidadeDisponivel(usinaData.capacidadeDisponivel);
      setCapacidadeEmUso(usinaData.capacidadeEmUso);
      console.log("Dados da usina:", usinaData.usuarios);
      setIsDataLoaded(true);
    } catch (error) {
      console.log("Erro ao buscar dados da usina", error);
    }
  };

  useEffect(() => {
    if (typeof id === "string") {
      const numericId = parseInt(id, 10);
      if (!isNaN(numericId)) {
        fetchUsinaData(numericId);
      }
    }
  }, [id]);

  const CadastrarUsuario = async () => {
    const planoMapped = planoMapping[parseInt(planoCadastro)];

    const userBody: any = {
      nome: nomeCadastro,
      email: emailCadastro,
      tipoConta: "Cliente",
      data_nascimento: dataNascimentoCadastro,
      cpfcnpj: cpfcnpjCadastro,
      telefone: telefoneCadastro,
      endereco: enderecoCadastro,
      consumoMedio: parseInt(consumoMedioCadastro),
      usina: Number(id),
      plano: planoMapped,
      tarifa: tarifaCadastro,
      uc: ucCadastro
    };

    console.log(userBody);

    try {
      setLoading(true);
      const data = await createUser(userBody);

      if (typeof id === "string") {
        const numericId = parseInt(id, 10);
        if (!isNaN(numericId)) {
          fetchUsinaData(numericId);
        }
      }
      
      onOpenChange();

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
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onRowsPerPageChange = React.useCallback((e: any) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const filteredItems = useMemo(() => {
    if (loading) {
      return [];
    }

    let filteredUsers = [...users];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((usina: UsinaData) =>
        usina.nome.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    return filteredUsers;
  }, [users, filterValue, loading, hasSearchFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const handleSelectionChange = (keys: any) => {
    setVisibleColumns(new Set(keys));
  };


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


  const renderCell = React.useCallback((user: UserInterface, columnKey: string) => {
    const cellValue = getKeyValue(user, columnKey);

    switch (columnKey) {
      case "nome":
        return (
          <Link href={`usina/${id}`}>
            <div className="flex r items-center gap-2">
              <p className="text-bold text-small capitalize">{cellValue}</p>
            </div>
          </Link>
        )
      case "plano":
        return <div className="flex r items-center gap-2">
          {cellValue !== null ? cellValue : "Não contratado"}
        </div>
      default:
        return <div className="flex r items-center gap-2">
          <p className="text-bold text-small capitalize">{cellValue}</p>
        </div>
    }
  }, [id]);

  return (
    <div>
      <div className="flex w-full flex-col pt-10 px-10 gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Procura pelo Nome..."
            startContent={<FaSearch />}
            value={filterValue}
            onClear={onClear}
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
              Cadastrar usuário
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-600">Total {users.length} usuários na usina</span>
          <label className="flex items-center text-default-600">
            Linhas por página
            <select className="bg-transparent outline-none text-default-600" onChange={onRowsPerPageChange}>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
        <div className="flex justify-center items-center gap-3 mb-4">
          <Card>
            <CardBody className="px-8 py-5">
              <h3 className="text-xl max-w-25 text-center">Capacidade</h3>
              <h3 className="text-xl max-w-26 text-center"> de Geração</h3>
              <p className="text-center text-4xl font-semibold !important">
                {isDataLoaded ? (capacidadeGeracao !== null ? capacidadeGeracao : <Spinner />) : <Spinner />} kw
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="px-8 py-5">
              <h3 className="text-xl text-center">Em uso</h3>
              <h3 className="text-xl max-w-26 text-center"> por clientes</h3>
              <p className="text-center text-4xl font-semibold !important">
                {isDataLoaded ? (capacidadeEmUso !== null ? capacidadeEmUso : <Spinner />) : <Spinner />} kw
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="px-8 py-5">
              <h3 className="text-xl max-w-26 text-center">Disponível para </h3>
              <h3 className="text-xl max-w-26 text-center"> novos usuários</h3>
              <p className="text-center text-4xl font-semibold !important">
                {isDataLoaded ? (capacidadeDisponivel !== null ? capacidadeDisponivel : <Spinner />) : <Spinner />} kw
              </p>
            </CardBody>
          </Card>
        </div>
      </div>

      <Table className="px-10" aria-label="tablea de usuarios"
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
        <TableBody emptyContent={"Nenhum usuário encontrado para essa usina."} items={sortedItems}>
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
                  label="Email"
                  variant="bordered"
                  value={emailCadastro}
                  onChange={(e) => setEmailCadastro(e.target.value)}
                />
                <Input
                  autoFocus
                  label="Endereço"
                  variant="bordered"
                  value={enderecoCadastro}
                  onChange={(e) => setEnderecoCadastro(e.target.value)}
                />
                <Input
                  autoFocus
                  label="Telefone"
                  variant="bordered"
                  value={telefoneCadastro}
                  onChange={(e) => setTelefoneCadastro(e.target.value)}
                />
                <DatePicker label="Data Nascimento" onChange={(e) => { setDataNascimentoCadastro(e.toString()) }} />
                <Input
                  autoFocus
                  label="CPF/CNPJ"
                  variant="bordered"
                  value={cpfcnpjCadastro}
                  onChange={(e) => setCpfcnpjCadastro(e.target.value)}
                />
                <Input
                  autoFocus
                  label="UC"
                  variant="bordered"
                  value={ucCadastro}
                  onChange={(e) => setUcCadastro(e.target.value)}
                />
                <Input
                  autoFocus
                  label="Consumo Médio"
                  variant="bordered"
                  value={consumoMedioCadastro}
                  onChange={(e) => setConsumoMedioCadastro(e.target.value)}
                />
                <Select
                  items={plans}
                  label="Plano de adesão"
                  placeholder="Selecione um plano"
                  value={planoCadastro}
                  onChange={(e) => setPlanoCadastro(e.target.value)}
                >
                  {(plan) => <SelectItem key={plan.value}>{plan.label}</SelectItem>}
                </Select>

                <Select
                  items={tarifas}
                  label="Tarifa"
                  placeholder="Selecione uma tarifa"
                  value={tarifaCadastro}
                  onChange={(e) => setTarifaCadastro(e.target.value)}
                >
                  {(tarifa) => <SelectItem key={tarifa.value}>{tarifa.label}</SelectItem>}
                </Select>
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
    </div>
  );
}
