import React from "react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@nextui-org/react";
import AcmeLogo from "../public/Vector.png";
import { useRouter } from 'next/router';
export default function Menu() {
  const router = useRouter();
  const getActiveNavItem = (route : string) => {
    console.log(route);
    if (route == '/Usinas') {
      return 'usinas';
    } else if (route === '/usina' || route === '/usuarios' || route === '/usuarios/1') {
      return 'usuarios';
    } else {
      return 'configs'; // Defina como vazio se nenhum item estiver ativo por padrão
    }
    
  };
  const activeNavItem = getActiveNavItem(router.pathname);
  return (
    <Navbar isBordered shouldHideOnScroll>
      <NavbarBrand>
        <p className="font-bold text-inherit"></p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem isActive={activeNavItem == 'usinas'}>
          <Link color={activeNavItem == 'usinas' ? "primary" : 'foreground'}  href="/Usinas">
            USINAS
          </Link>
        </NavbarItem>
        <NavbarItem isActive={activeNavItem == 'usuarios'}>
          <Link color={activeNavItem == 'usuarios' ? "primary" : 'foreground'} href="/usuarios" aria-current="page">
            USUÁRIOS
          </Link>
        </NavbarItem>
        <NavbarItem isActive={activeNavItem == 'configs'}>
          <Link color={activeNavItem == 'configs' ? "primary" : 'foreground'} href="configs">
            CONFIGURAÇÕES
          </Link>
        </NavbarItem>
      </NavbarContent>
      
    </Navbar>
  );
}
