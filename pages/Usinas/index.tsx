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
  User,
  SortDescriptor,
  Select,
  SelectItem,

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
import { deleteUsina, getAllGestorUsersData, getAllUsersData, getAllUsinasData, getUsinaById, updateUsina, usinaCreate } from "../../services/api-usinas";
import { set } from "zod";
//Interfaces
interface UsinaColumn {
  key: string;
  label: string;
}

interface UsuarioResponsavel {
  nome: string;
  email: string;
  telefone: string;
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
  usuarioResponsavel: UsuarioResponsavel
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
    key: "quantidadeClientes",
    label: "Número de Clientes",
  },
  {
    key: "VagasClientes",
    label: "Vagas dos Clientes",
  },
  {
    key: "responsavel",
    label: "Responsável pela Usina"
  },
  {
    key: "actions",
    label: "Ações",
  }
];

const tarifas = [
  {
    value: "Grupo tarifário B",
    label: "Grupo tarifário B"
  },
  {
    value: "Grupo tarifário Horo-Sazonal Azul",
    label: "Grupo tarifário Horo-Sazonal Azul"
  },
  {
    value: "Grupo tarifário Horo-Sazonal Verde",
    label: "Grupo tarifário Horo-Sazonal Verde"
  },


]

const INITIAL_VISIBLE_COLUMNS = ["nome", "localizacao", "potenciaInstalada", "numeroClientes", "capacidadeClientes", "capacidadeGeracao", "responsavel", "actions"];
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
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [nomeUsina, setNomeUsina] = useState("");
  const [estadoUsina, setEstadoUsina] = useState("");
  const [potenciaInstaladaUsina, setPotenciaInstaladaUsina] = useState("");
  const [potenciaNominalUsina, setPotenciaNominalUsina] = useState("");
  const [capacidadeGeracaoUsina, setCapacidadeGeracaoUsina] = useState("");
  const [animacaoCadastro, setAnimacaoCadastro] = useState("");
  const [animacaoEdicao, setAnimacaoEdicao] = useState("");
  const [selectedResponsavelUserId, setSelectedResponsavelUserId] = useState(null);
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
  const [selectedUsinaId, setSelectedUsinaId] = useState<number | null>(null);
  const [editUsinaModalOpen, setEditUsinaModalOpen] = useState(false);
  const [tarifaCadastro, setTarifaCadastro] = useState("");
  const [ucCadastro, setUcCadastro] = useState("");
  const [usinaData, setUsinaData] = useState(null);

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

  const openDeleteConfirmationModal = () => {
    fetchDataUsinas();
    setConfirmDeleteModalOpen(true);
  };

  const closeDeleteConfirmationModal = () => {
    fetchDataUsinas();
    setConfirmDeleteModalOpen(false);
  };

  const openEditUsinaModal = () => {
    setEditUsinaModalOpen(true);
  };

  const closeEditUsinaModal = () => {
    fetchDataUsinas();
    setEditUsinaModalOpen(false);
  }

  useEffect(() => {
    if (selectedUsinaId !== null) {
      const fetchData = async () => {
        try {
          const data = await getUsinaById(selectedUsinaId);
          setUsinaData(data);
          setNomeUsina(data.nome);
          setEstadoUsina(data.localizacao);
          setPotenciaInstaladaUsina(data.potenciaInstalada);
          setPotenciaNominalUsina(data.potenciaNominal);
          setCapacidadeGeracaoUsina(data.capacidadeGeracao);

          setUsinas(data.length)
        } catch (error) {
          console.error("Erro ao buscar dados da usina", error);
        }
      };

      fetchData();
    }
  }, [selectedUsinaId]);

  const handleUpdateUsina = async () => {
    setAnimacaoEdicao("loading");

    if (selectedUsinaId === null || selectedResponsavelUserId === null) {
      setAnimacaoEdicao(""); // Reseta a animação se os IDs forem nulos
      return;
    }

    const usinaBody = {
      nome: nomeUsina,
      localizacao: estadoUsina,
      potenciaInstalada: parseInt(potenciaInstaladaUsina),
      potenciaNominal: parseInt(potenciaNominalUsina),
      capacidadeGeracao: parseInt(capacidadeGeracaoUsina),
      usuarioResponsavel: selectedResponsavelUserId,
    };

    try {
      await updateUsina(selectedUsinaId, usinaBody);
      setAnimacaoEdicao("success");

      // Aguarda um curto período para garantir que a animação seja exibida
      setTimeout(() => {
        setAnimacaoEdicao("");
        closeEditUsinaModal();
        fetchDataUsinas();
        // Redefine todos os estados relevantes após a atualização
        setSelectedUsinaId(null);
        setNomeUsina('');
        setEstadoUsina('');
        setPotenciaInstaladaUsina('');
        setPotenciaNominalUsina('');
        setCapacidadeGeracaoUsina('');
        setSelectedResponsavelUserId(null);
      }, 1000); // Ajuste o tempo conforme necessário
    } catch (error) {
      setAnimacaoEdicao("error");
      console.error("Erro ao atualizar a usina", error);

      // Aguarda um curto período para garantir que a animação de erro seja exibida
      setTimeout(() => {
        setAnimacaoEdicao("");
      }, 1000); // Ajuste o tempo conforme necessário
    }
  };


  const fetchUserData = async () => {
    try {
      const userData = await getAllGestorUsersData();
      setUsers(userData || []);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  }

  const fetchDataUsinas = async () => {
    try {
      setLoading(true);
      const usinasData = await getAllUsinasData();
      console.log(usinasData);
      setUsinas(usinasData || []);
    } catch (error) {
      console.error('Failed to fetch usinas:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasSearchFilter = Boolean(filterValue);
  useEffect(() => {
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


    const usinaBody = {
      usuarioResponsavel: selectedResponsavelUserId,
      nome: nomeUsina,
      localizacao: estadoUsina,
      potenciaInstalada: parseInt(potenciaInstaladaUsina),
      potenciaNominal: parseInt(potenciaNominalUsina),
      capacidadeGeracao: parseInt(capacidadeGeracaoUsina),
      tributacao: tarifaCadastro,
      uc: ucCadastro
    };
    console.log(usinaBody);

    try {
      const data = await usinaCreate(usinaBody);

      console.log('Usina cadastrada com sucesso:', data);
      setAnimacaoCadastro("success");
      fetchDataUsinas();
      limparFormulario();

      setTimeout(() => {
        onOpenChange();
        setAnimacaoCadastro("");
      }, 1000);
    } catch (error) {
      console.error('Erro ao cadastrar usina:', error);
      setAnimacaoCadastro("error");
      setTimeout(() => {
        setAnimacaoCadastro("");
      }, 1000);
    }
  };

  const handleDeleteUsina = async (id: number) => {
    try {
      await deleteUsina(id);
      fetchDataUsinas();
    } catch (error) {
      console.log("Erro ao excluir a usina", error);
    }
  };

  const handleTarifaChange = (value: any) => {
    setTarifaCadastro(value.target.value);
  };

  useEffect(() => {
    fetchDataUsinas();
  }, []);

  const limparFormulario = () => {
    setNomeUsina("");
    setEstadoUsina("");
    setPotenciaInstaladaUsina("");
    setPotenciaNominalUsina("");
    setCapacidadeGeracaoUsina("");
    setTarifaCadastro("");
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
  }, [usinas, filterValue, hasSearchFilter]);


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

  const handleSelectionChange = (keys: any) => {
    setVisibleColumns(new Set(keys));
  };



  const renderCell = React.useCallback((usina: Usina, columnKey: string) => {
    
    const cellValue = getKeyValue(usina, columnKey);

    switch (columnKey) {
      case "responsavel":
        return(
          <div className="flex flex-col items-center gap-2">
            <p className="text-bold text-small capitalize"><b>Nome:</b> {usina.usuarioResponsavel.nome}</p>
            <p className="text-bold text-small capitalize"><b>E-mail:</b> {usina.usuarioResponsavel.email}</p>
            <p className="text-bold text-small capitalize"><b>Telefone:</b> {usina.usuarioResponsavel.telefone}</p>
          </div>
        )
      case "nome":
        return (
          <Link href={`usina/${usina.id}`}>
            <div className="flex items-center gap-2">
              <p className="text-bold text-small capitalize">{cellValue}</p>
            </div>
          </Link>
        );
      case "VagasClientes":
      case "capacidadeClientes":
        const parsedValue = parseInt(cellValue);
        const displayValue = isNaN(parsedValue) || cellValue === null ? 'Sem clientes cadastrados' : parsedValue;
        return (
          <div className="flex items-center gap-2">
            <p className="text-bold text-small capitalize">{displayValue}</p>
          </div>
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
                <DropdownItem onClick={() => {
                  setSelectedUsinaId(usina.id);
                  openEditUsinaModal();
                }}>Editar</DropdownItem>
                <DropdownItem onClick={() => {
                  setSelectedUsinaId(usina.id);
                  openDeleteConfirmationModal();
                }}>Apagar</DropdownItem>
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
    onClear,
    onOpen,
    onSearchChange,
    usinas.length
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

  const retornaAnimacaoEdicao = () => {
    switch (animacaoEdicao) {
      case "loading":
        return (
          <ModalBody>
            <Spinner label="atualizando usina" size="lg" />
          </ModalBody>
        )

      case "success":
        return (
          <ModalBody>
            <p>Usina editada com sucesso!</p>
          </ModalBody>
        )

      case "error":
        return (
          <ModalBody>
            <p>Ocorreu um erro ao editar a usina!</p>
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
          {(column: UsinaColumn) => <TableColumn className="tableColumnTitle  justify-center" key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody emptyContent={loading ? <Spinner label="Carregando..." /> : "Nenhuma usina encontrada"}>
          {sortedItems.map((usina) => (
            <TableRow key={usina.id}>
              {(columnKey: any) => <TableCell>{renderCell(usina, columnKey)}</TableCell>}
            </TableRow>
          ))}
        </TableBody>

      </Table>

      <Modal
        isOpen={confirmDeleteModalOpen}
        onOpenChange={closeDeleteConfirmationModal}
        placement="center"
      >
        <ModalContent>
          <ModalHeader>Confirmação de Exclusão</ModalHeader>
          <ModalBody>
            <p>Deseja realmente apagar esta usina?</p>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onPress={() => {
              if (selectedUsinaId !== null) {
                handleDeleteUsina(selectedUsinaId);
                closeDeleteConfirmationModal();
              }
            }}>
              Confirmar
            </Button>
            <Button onPress={closeDeleteConfirmationModal}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={editUsinaModalOpen}
        onOpenChange={closeEditUsinaModal}
        placement="center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Editar Usina</ModalHeader>
              {animacaoEdicao === "" ? (
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
                      isRequired
                      label="Estado"
                      value={estadoUsina}
                      onValueChange={setEstadoUsina}
                      variant="bordered"
                    />
                    <Input
                      isRequired
                      label="Potência Instalada"
                      variant="bordered"
                      value={potenciaInstaladaUsina}
                      onValueChange={setPotenciaInstaladaUsina}
                    />
                    <Input
                      isRequired
                      value={potenciaNominalUsina}
                      onValueChange={setPotenciaNominalUsina}
                      type="number"
                      label="Potência Nominal"
                      variant="bordered"
                    />
                    <Input
                      isRequired
                      label="Capacidade de Geração"
                      value={capacidadeGeracaoUsina}
                      onValueChange={setCapacidadeGeracaoUsina}
                      variant="bordered"
                    />
                    <Input
                      isRequired
                      label="UC"
                      value={ucCadastro}
                      onValueChange={setUcCadastro}
                      variant="bordered"
                    />

                    <Select
                      items={tarifas}
                      onChange={handleTarifaChange}
                      label="Tarifa"
                      placeholder="Selecione uma tarifa"

                    >
                      {(tarifa) => <SelectItem key={tarifa.value}>{tarifa.label}</SelectItem>}
                    </Select>
                    

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
                    <Button color="primary" onPress={handleUpdateUsina}>
                      Salvar
                    </Button>
                    <Button onPress={onClose}>
                      Cancelar
                    </Button>
                  </ModalFooter>
                </>
              ) : retornaAnimacaoEdicao()}
            </>
          )}
        </ModalContent>
      </Modal>

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

                     <Input
                      isRequired
                      label="UC"
                      value={ucCadastro}
                      onValueChange={setUcCadastro}
                      variant="bordered"
                    />

                    <Select
                      items={tarifas}
                      onChange={handleTarifaChange}
                      label="Tarifa"
                      placeholder="Selecione uma tarifa"

                    >
                      {(tarifa) => <SelectItem key={tarifa.value}>{tarifa.label}</SelectItem>}
                    </Select>
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
