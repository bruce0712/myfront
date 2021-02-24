
var route23 = [
    {
      path: "/",
      component: "../layouts/BasicLayout",
      routes: [
        {
          path: "/",
          redirect: "/workbench",
        },
        {
          path: "/workbench",
          name: "工作台",
          icon: "AppstoreOutlined",
          component: "./Workbench",
          authority: ["workbench"],
        },
        {
          path: "/customer",
          name: "客户管理",
          icon: "TeamOutlined",
          // authority: ['customer-detail', 'customer-list'], // 菜单下所有子菜单都需要控制权限时，才需要配置
          routes: [
            {
              path: "/customer/list",
              name: "客户列表",
              component: "./customer/List",
              authority: ["customer-list"],
            },
            {
              path: "/customer/details",
              name: "客户详情",
              component: "./customer/Details",
              authority: ["customer-detail"],
            },
          ],
        },
        {
          component: "./404",
        },
      ],
    },
    {
      component: "./404",
    },
  ];
  function addAuthority2(router) {
        if(router === null || router === undefined) return 
      
        router.forEach(route => {
            if(route.routes instanceof Array) {
                addAuthority2(route.routes)
                route.authority = defineAuthority(route.routes)
            }
        })
  }

  function defineAuthority(routes) {
      let authoritys = [];
      if(routes === null || routes === undefined) return authoritys
      routes.forEach(item => {
          if(!item.authority) {
            item.authority = ['custom']
            authoritys.push('custom')
          }else {
            authoritys.push(...item.authority) 
          }
      })
      return authoritys
  }

  addAuthority2(route23)
  console.log(JSON.stringify(route23, null, 2))