// function middleNum(nums1,nums2) {
//     let centerNum = 0;
//     if((nums1.length === 1 &&  nums2.length ===0) || (nums1.length === 0 &&  nums2.length ===1) ) {
//         centerNum = nums1[0] || nums2[1]
//     }

    

//     return centerNum;
// }



// const addAuthority = (routes) => {
//     if (routes?.length) {
//       return routes.map((item) => ({
//         ...item,
//         routes: item?.routes ? addAuthority(item.routes) : null,
//         authority: item?.routes ? null : item?.authority || ["common_auth"],
//       }));
//     }
  
//     return [];
//   };
  
//   const getAuthority = (routes) => {
//     let auth = [];
//     if (!routes.routes) {
//       routes.forEach((item) => {
//         auth = auth.concat(item.authority);
//       });
//     } else {
//       auth = auth.concat(getAuthority(routes.routes));
//     }
//     return auth;
//   };
  
//   const transRoute = (routes) => {
//     if (routes?.length) {
//       return routes.map((item) => ({
//         ...item,
//         routes: item?.routes ? transRoute(item.routes) : null,
//         authority: item?.routes ? getAuthority(item.routes) : item?.authority,
//       }));
//     }
  
//     return [];
//   };
  
  const route1 = [
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
  



//   const routes = addAuthority(route1);
  
//   console.log(JSON.stringify(transRoute(route1), null, 2), "dddd");
//   // console.log(JSON.stringify(addAuthority(route1), null, 2), "add");


  function addAuthority2(router) {
      if(router === null) return 

      addAuthority2(router.routes)
      router.authority = defineAuthority(router.routes)
      
  }

  function defineAuthority(routes) {
      let authoritys = []
      routes.forEach(item => {
          if(!item.authority) {
            routes.authority = ['custom']
            authoritys.push(custom)
          }else {
            authoritys.push(...item.authority) 
          }
      })
      return authoritys
  }

  console.log(addAuthority2(route1))