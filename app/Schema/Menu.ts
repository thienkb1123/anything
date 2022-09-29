type Menu = {
    ID: number
    Name: string
    Slug: string
}

type MenuList = {
    ID: number
    Name: string
    Slug: string
    SubMenu: Menu[]
}