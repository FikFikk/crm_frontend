<template>
  <DashboardLayout>
    <div class="grid grid-cols-12 gap-6">
      <div class="col-span-12 2xl:col-span-9">
        <div class="grid grid-cols-12 gap-6">
          <!-- BEGIN: General Report -->
          <div class="col-span-12 mt-8">
            <div class="intro-y flex items-center h-10">
              <h2 class="text-lg font-medium truncate mr-5">
                General Report
              </h2>
              <a href="" class="ml-auto flex items-center text-primary" @click.prevent="refreshData">
                <i data-feather="refresh-ccw" class="w-4 h-4 mr-3"></i> Reload Data
              </a>
            </div>
            <div class="grid grid-cols-12 gap-6 mt-5">
              <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                <div class="report-box zoom-in">
                  <div class="box p-5">
                    <div class="flex">
                      <i data-feather="shopping-cart" class="report-box__icon text-primary"></i>
                      <div class="ml-auto">
                        <div class="report-box__indicator bg-success tooltip cursor-pointer" title="33% Higher than last month">
                          33% <i data-feather="chevron-up" class="w-4 h-4 ml-0.5"></i>
                        </div>
                      </div>
                    </div>
                    <div class="text-3xl font-medium leading-8 mt-6">4.710</div>
                    <div class="text-base text-slate-500 mt-1">Item Sales</div>
                  </div>
                </div>
              </div>
              <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                <div class="report-box zoom-in">
                  <div class="box p-5">
                    <div class="flex">
                      <i data-feather="credit-card" class="report-box__icon text-pending"></i>
                      <div class="ml-auto">
                        <div class="report-box__indicator bg-danger tooltip cursor-pointer" title="2% Lower than last month">
                          2% <i data-feather="chevron-down" class="w-4 h-4 ml-0.5"></i>
                        </div>
                      </div>
                    </div>
                    <div class="text-3xl font-medium leading-8 mt-6">3.721</div>
                    <div class="text-base text-slate-500 mt-1">New Orders</div>
                  </div>
                </div>
              </div>
              <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                <div class="report-box zoom-in">
                  <div class="box p-5">
                    <div class="flex">
                      <i data-feather="monitor" class="report-box__icon text-warning"></i>
                      <div class="ml-auto">
                        <div class="report-box__indicator bg-success tooltip cursor-pointer" title="12% Higher than last month">
                          12% <i data-feather="chevron-up" class="w-4 h-4 ml-0.5"></i>
                        </div>
                      </div>
                    </div>
                    <div class="text-3xl font-medium leading-8 mt-6">2.149</div>
                    <div class="text-base text-slate-500 mt-1">Total Products</div>
                  </div>
                </div>
              </div>
              <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                <div class="report-box zoom-in">
                  <div class="box p-5">
                    <div class="flex">
                      <i data-feather="user" class="report-box__icon text-success"></i>
                      <div class="ml-auto">
                        <div class="report-box__indicator bg-success tooltip cursor-pointer" title="22% Higher than last month">
                          22% <i data-feather="chevron-up" class="w-4 h-4 ml-0.5"></i>
                        </div>
                      </div>
                    </div>
                    <div class="text-3xl font-medium leading-8 mt-6">152.040</div>
                    <div class="text-base text-slate-500 mt-1">Unique Visitor</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- END: General Report -->
          
          <!-- BEGIN: Sales Report -->
          <div class="col-span-12 lg:col-span-6 mt-8">
            <div class="intro-y block sm:flex items-center h-10">
              <h2 class="text-lg font-medium truncate mr-5">
                Sales Report
              </h2>
              <div class="sm:ml-auto mt-3 sm:mt-0 relative text-slate-500">
                <i data-feather="calendar" class="w-4 h-4 z-10 absolute my-auto inset-y-0 ml-3 left-0"></i>
                <input type="text" class="datepicker form-control sm:w-56 box pl-10">
              </div>
            </div>
            <div class="intro-y box p-5 mt-12 sm:mt-5">
              <div class="flex flex-col xl:flex-row xl:items-center">
                <div class="flex">
                  <div>
                    <div class="text-primary dark:text-slate-300 text-lg xl:text-xl font-medium">$15,000</div>
                    <div class="mt-0.5 text-slate-500">This Month</div>
                  </div>
                  <div class="w-px h-12 border border-r border-dashed border-slate-200 dark:border-darkmode-300 mx-4 xl:mx-5"></div>
                  <div>
                    <div class="text-slate-500 text-lg xl:text-xl font-medium">$10,000</div>
                    <div class="mt-0.5 text-slate-500">Last Month</div>
                  </div>
                </div>
                <div class="dropdown xl:ml-auto mt-5 xl:mt-0">
                  <button class="dropdown-toggle btn btn-outline-secondary font-normal" aria-expanded="false" data-tw-toggle="dropdown">
                    Filter by Category <i data-feather="chevron-down" class="w-4 h-4 ml-2"></i>
                  </button>
                  <div class="dropdown-menu w-40">
                    <ul class="dropdown-content overflow-y-auto h-32">
                      <li><a href="" class="dropdown-item">PC & Laptop</a></li>
                      <li><a href="" class="dropdown-item">Smartphone</a></li>
                      <li><a href="" class="dropdown-item">Electronic</a></li>
                      <li><a href="" class="dropdown-item">Photography</a></li>
                      <li><a href="" class="dropdown-item">Sport</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="report-chart">
                <canvas id="report-line-chart" height="169" class="mt-6"></canvas>
              </div>
            </div>
          </div>
          <!-- END: Sales Report -->
          
          <!-- BEGIN: Weekly Top Seller -->
          <div class="col-span-12 sm:col-span-6 lg:col-span-3 mt-8">
            <div class="intro-y flex items-center h-10">
              <h2 class="text-lg font-medium truncate mr-5">
                Weekly Top Seller
              </h2>
              <a href="" class="ml-auto text-primary truncate">Show More</a>
            </div>
            <div class="intro-y box p-5 mt-5">
              <canvas class="mt-3" id="report-pie-chart" height="300"></canvas>
              <div class="mt-8">
                <div class="flex items-center">
                  <div class="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  <span class="truncate">17 - 30 Years old</span> <span class="font-medium xl:ml-auto">62%</span>
                </div>
                <div class="flex items-center mt-4">
                  <div class="w-2 h-2 bg-pending rounded-full mr-3"></div>
                  <span class="truncate">31 - 50 Years old</span> <span class="font-medium xl:ml-auto">33%</span>
                </div>
                <div class="flex items-center mt-4">
                  <div class="w-2 h-2 bg-warning rounded-full mr-3"></div>
                  <span class="truncate">>= 50 Years old</span> <span class="font-medium xl:ml-auto">10%</span>
                </div>
              </div>
            </div>
          </div>
          <!-- END: Weekly Top Seller -->
          
          <!-- BEGIN: Sales Report -->
          <div class="col-span-12 sm:col-span-6 lg:col-span-3 mt-8">
            <div class="intro-y flex items-center h-10">
              <h2 class="text-lg font-medium truncate mr-5">
                Sales Report
              </h2>
              <a href="" class="ml-auto text-primary truncate">Show More</a>
            </div>
            <div class="intro-y box p-5 mt-5">
              <canvas class="mt-3" id="report-donut-chart" height="300"></canvas>
              <div class="mt-8">
                <div class="flex items-center">
                  <div class="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  <span class="truncate">17 - 30 Years old</span> <span class="font-medium xl:ml-auto">62%</span>
                </div>
                <div class="flex items-center mt-4">
                  <div class="w-2 h-2 bg-pending rounded-full mr-3"></div>
                  <span class="truncate">31 - 50 Years old</span> <span class="font-medium xl:ml-auto">33%</span>
                </div>
                <div class="flex items-center mt-4">
                  <div class="w-2 h-2 bg-warning rounded-full mr-3"></div>
                  <span class="truncate">>= 50 Years old</span> <span class="font-medium xl:ml-auto">10%</span>
                </div>
              </div>
            </div>
          </div>
          <!-- END: Sales Report -->
          
          <!-- BEGIN: Official Store -->
          <div class="col-span-12 xl:col-span-8 mt-6">
            <div class="intro-y block sm:flex items-center h-10">
              <h2 class="text-lg font-medium truncate mr-5">
                Official Store
              </h2>
              <div class="sm:ml-auto mt-3 sm:mt-0 relative text-slate-500">
                <i data-feather="map-pin" class="w-4 h-4 z-10 absolute my-auto inset-y-0 ml-3 left-0"></i>
                <input type="text" class="form-control sm:w-40 box pl-10" placeholder="Filter by city">
              </div>
            </div>
            <div class="intro-y box p-5 mt-12 sm:mt-5">
              <div>250 Official stores in 21 countries, click the marker to see location details.</div>
              <div class="report-maps mt-5 bg-slate-200 rounded-md h-64"></div>
            </div>
          </div>
          <!-- END: Official Store -->
          
          <!-- BEGIN: Weekly Best Sellers -->
          <div class="col-span-12 xl:col-span-4 mt-6">
            <div class="intro-y flex items-center h-10">
              <h2 class="text-lg font-medium truncate mr-5">
                Weekly Best Sellers
              </h2>
            </div>
            <div class="mt-5">
              <div class="intro-y" v-for="seller in bestSellers" :key="seller.id">
                <div class="box px-4 py-4 mb-3 flex items-center zoom-in">
                  <div class="w-10 h-10 flex-none image-fit rounded-md overflow-hidden">
                    <img alt="Profile" :src="seller.avatar" class="rounded-full">
                  </div>
                  <div class="ml-4 mr-auto">
                    <div class="font-medium">{{ seller.name }}</div>
                    <div class="text-slate-500 text-xs mt-0.5">{{ seller.date }}</div>
                  </div>
                  <div class="py-1 px-2 rounded-full text-xs bg-success text-white cursor-pointer font-medium">
                    {{ seller.sales }} Sales
                  </div>
                </div>
              </div>
              <a href="" class="intro-y w-full block text-center rounded-md py-4 border border-dotted border-slate-400 dark:border-darkmode-300 text-slate-500">View More</a>
            </div>
          </div>
          <!-- END: Weekly Best Sellers -->
          
          <!-- BEGIN: General Report -->
          <div class="col-span-12 grid grid-cols-12 gap-6 mt-8">
            <div class="col-span-12 sm:col-span-6 2xl:col-span-3 intro-y">
              <div class="box p-5 zoom-in">
                <div class="flex items-center">
                  <div class="w-2/4 flex-none">
                    <div class="text-lg font-medium truncate">Target Sales</div>
                    <div class="text-slate-500 mt-1">300 Sales</div>
                  </div>
                  <div class="flex-none ml-auto relative">
                    <canvas id="report-donut-chart-1" width="90" height="90"></canvas>
                    <div class="font-medium absolute w-full h-full flex items-center justify-center top-0 left-0">20%</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-span-12 sm:col-span-6 2xl:col-span-3 intro-y">
              <div class="box p-5 zoom-in">
                <div class="flex">
                  <div class="text-lg font-medium truncate mr-3">Social Media</div>
                  <div class="py-1 px-2 flex items-center rounded-full text-xs bg-slate-100 dark:bg-darkmode-400 text-slate-500 cursor-pointer ml-auto truncate">320 Followers</div>
                </div>
                <div class="mt-4">
                  <canvas class="simple-line-chart-1 -ml-1" height="60"></canvas>
                </div>
              </div>
            </div>
            <div class="col-span-12 sm:col-span-6 2xl:col-span-3 intro-y">
              <div class="box p-5 zoom-in">
                <div class="flex items-center">
                  <div class="w-2/4 flex-none">
                    <div class="text-lg font-medium truncate">New Products</div>
                    <div class="text-slate-500 mt-1">1450 Products</div>
                  </div>
                  <div class="flex-none ml-auto relative">
                    <canvas id="report-donut-chart-2" width="90" height="90"></canvas>
                    <div class="font-medium absolute w-full h-full flex items-center justify-center top-0 left-0">45%</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-span-12 sm:col-span-6 2xl:col-span-3 intro-y">
              <div class="box p-5 zoom-in">
                <div class="flex">
                  <div class="text-lg font-medium truncate mr-3">Posted Ads</div>
                  <div class="py-1 px-2 flex items-center rounded-full text-xs bg-slate-100 dark:bg-darkmode-400 text-slate-500 cursor-pointer ml-auto truncate">180 Campaign</div>
                </div>
                <div class="mt-4">
                  <canvas class="simple-line-chart-1 -ml-1" height="60"></canvas>
                </div>
              </div>
            </div>
          </div>
          <!-- END: General Report -->
          
          <!-- BEGIN: Weekly Top Products -->
          <div class="col-span-12 mt-6">
            <div class="intro-y block sm:flex items-center h-10">
              <h2 class="text-lg font-medium truncate mr-5">
                Weekly Top Products
              </h2>
              <div class="flex items-center sm:ml-auto mt-3 sm:mt-0">
                <button class="btn box flex items-center text-slate-600 dark:text-slate-300">
                  <i data-feather="file-text" class="hidden sm:block w-4 h-4 mr-2"></i> Export to Excel
                </button>
                <button class="ml-3 btn box flex items-center text-slate-600 dark:text-slate-300">
                  <i data-feather="file-text" class="hidden sm:block w-4 h-4 mr-2"></i> Export to PDF
                </button>
              </div>
            </div>
            <div class="intro-y overflow-auto lg:overflow-visible mt-8 sm:mt-0">
              <table class="table table-report sm:mt-2">
                <thead>
                  <tr>
                    <th class="whitespace-nowrap">IMAGES</th>
                    <th class="whitespace-nowrap">PRODUCT NAME</th>
                    <th class="text-center whitespace-nowrap">STOCK</th>
                    <th class="text-center whitespace-nowrap">STATUS</th>
                    <th class="text-center whitespace-nowrap">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="intro-x" v-for="product in topProducts" :key="product.id">
                    <td class="w-40">
                      <div class="flex">
                        <div class="w-10 h-10 image-fit zoom-in" v-for="(image, idx) in product.images" :key="idx">
                          <img alt="Product" class="tooltip rounded-full" :src="image.src" :title="image.title" :class="{ '-ml-5': idx > 0 }">
                        </div>
                      </div>
                    </td>
                    <td>
                      <a href="" class="font-medium whitespace-nowrap">{{ product.name }}</a>
                      <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">{{ product.category }}</div>
                    </td>
                    <td class="text-center">{{ product.stock }}</td>
                    <td class="w-40">
                      <div class="flex items-center justify-center" :class="product.status === 'Active' ? 'text-success' : 'text-danger'">
                        <i data-feather="check-square" class="w-4 h-4 mr-2"></i> {{ product.status }}
                      </div>
                    </td>
                    <td class="table-report__action w-56">
                      <div class="flex justify-center items-center">
                        <a class="flex items-center mr-3" href="">
                          <i data-feather="check-square" class="w-4 h-4 mr-1"></i> Edit
                        </a>
                        <a class="flex items-center text-danger" href="">
                          <i data-feather="trash-2" class="w-4 h-4 mr-1"></i> Delete
                        </a>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="intro-y flex flex-wrap sm:flex-row sm:flex-nowrap items-center mt-3">
              <nav class="w-full sm:w-auto sm:mr-auto">
                <ul class="pagination">
                  <li class="page-item">
                    <a class="page-link" href="#"> <i class="w-4 h-4" data-feather="chevrons-left"></i> </a>
                  </li>
                  <li class="page-item">
                    <a class="page-link" href="#"> <i class="w-4 h-4" data-feather="chevron-left"></i> </a>
                  </li>
                  <li class="page-item"> <a class="page-link" href="#">...</a> </li>
                  <li class="page-item"> <a class="page-link" href="#">1</a> </li>
                  <li class="page-item active"> <a class="page-link" href="#">2</a> </li>
                  <li class="page-item"> <a class="page-link" href="#">3</a> </li>
                  <li class="page-item"> <a class="page-link" href="#">...</a> </li>
                  <li class="page-item">
                    <a class="page-link" href="#"> <i class="w-4 h-4" data-feather="chevron-right"></i> </a>
                  </li>
                  <li class="page-item">
                    <a class="page-link" href="#"> <i class="w-4 h-4" data-feather="chevrons-right"></i> </a>
                  </li>
                </ul>
              </nav>
              <select class="w-20 form-select box mt-3 sm:mt-0">
                <option>10</option>
                <option>25</option>
                <option>35</option>
                <option>50</option>
              </select>
            </div>
          </div>
          <!-- END: Weekly Top Products -->
        </div>
      </div>
      
      <div class="col-span-12 2xl:col-span-3">
        <div class="2xl:border-l -mb-10 pb-10">
          <div class="2xl:pl-6 grid grid-cols-12 gap-6">
            <!-- BEGIN: Transactions -->
            <div class="col-span-12 md:col-span-6 xl:col-span-4 2xl:col-span-12 mt-3 2xl:mt-8">
              <div class="intro-x flex items-center h-10">
                <h2 class="text-lg font-medium truncate mr-5">
                  Transactions
                </h2>
              </div>
              <div class="mt-5">
                <div class="intro-x" v-for="transaction in transactions" :key="transaction.id">
                  <div class="box px-5 py-3 mb-3 flex items-center zoom-in">
                    <div class="w-10 h-10 flex-none image-fit rounded-full overflow-hidden">
                      <img alt="Profile" :src="transaction.avatar">
                    </div>
                    <div class="ml-4 mr-auto">
                      <div class="font-medium">{{ transaction.name }}</div>
                      <div class="text-slate-500 text-xs mt-0.5">{{ transaction.date }}</div>
                    </div>
                    <div :class="transaction.amount > 0 ? 'text-success' : 'text-danger'">
                      {{ transaction.amount > 0 ? '+' : '' }}${{ Math.abs(transaction.amount) }}
                    </div>
                  </div>
                </div>
                <a href="" class="intro-x w-full block text-center rounded-md py-3 border border-dotted border-slate-400 dark:border-darkmode-300 text-slate-500">View More</a>
              </div>
            </div>
            <!-- END: Transactions -->
            
            <!-- BEGIN: Recent Activities -->
            <div class="col-span-12 md:col-span-6 xl:col-span-4 2xl:col-span-12 mt-3">
              <div class="intro-x flex items-center h-10">
                <h2 class="text-lg font-medium truncate mr-5">
                  Recent Activities
                </h2>
                <a href="" class="ml-auto text-primary truncate">Show More</a>
              </div>
              <div class="mt-5 relative before:block before:absolute before:w-px before:h-[85%] before:bg-slate-200 before:dark:bg-darkmode-400 before:ml-5 before:mt-5">
                <div class="intro-x relative flex items-center mb-3" v-for="activity in recentActivities" :key="activity.id">
                  <div class="before:block before:absolute before:w-20 before:h-px before:bg-slate-200 before:dark:bg-darkmode-400 before:mt-5 before:ml-5">
                    <div class="w-10 h-10 flex-none image-fit rounded-full overflow-hidden">
                      <img alt="Profile" :src="activity.avatar">
                    </div>
                  </div>
                  <div class="box px-5 py-3 ml-4 flex-1 zoom-in">
                    <div class="flex items-center">
                      <div class="font-medium">{{ activity.name }}</div>
                      <div class="text-xs text-slate-500 ml-auto">{{ activity.time }}</div>
                    </div>
                    <div class="text-slate-500 mt-1">{{ activity.description }}</div>
                  </div>
                </div>
              </div>
            </div>
            <!-- END: Recent Activities -->
            
            <!-- BEGIN: Important Notes -->
            <div class="col-span-12 md:col-span-6 xl:col-span-12 xl:col-start-1 xl:row-start-1 2xl:col-start-auto 2xl:row-start-auto mt-3">
              <div class="intro-x flex items-center h-10">
                <h2 class="text-lg font-medium truncate mr-auto">
                  Important Notes
                </h2>
                <button class="tiny-slider-navigator btn px-2 border-slate-300 text-slate-600 dark:text-slate-300 mr-2">
                  <i data-feather="chevron-left" class="w-4 h-4"></i>
                </button>
                <button class="tiny-slider-navigator btn px-2 border-slate-300 text-slate-600 dark:text-slate-300 mr-2">
                  <i data-feather="chevron-right" class="w-4 h-4"></i>
                </button>
              </div>
              <div class="mt-5 intro-x">
                <div class="box zoom-in">
                  <div v-for="(note, index) in importantNotes" :key="note.id" :class="{ hidden: index !== currentNoteIndex }" class="p-5">
                    <div class="text-base font-medium truncate">{{ note.title }}</div>
                    <div class="text-slate-400 mt-1">{{ note.date }}</div>
                    <div class="text-slate-500 text-justify mt-1">{{ note.content }}</div>
                    <div class="font-medium flex mt-5">
                      <button type="button" class="btn btn-secondary py-1 px-2">View Notes</button>
                      <button type="button" class="btn btn-outline-secondary py-1 px-2 ml-auto">Dismiss</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- END: Important Notes -->
            
            <!-- BEGIN: Schedules -->
            <div class="col-span-12 md:col-span-6 xl:col-span-4 2xl:col-span-12 xl:col-start-1 xl:row-start-2 2xl:col-start-auto 2xl:row-start-auto mt-3">
              <div class="intro-x flex items-center h-10">
                <h2 class="text-lg font-medium truncate mr-5">
                  Schedules
                </h2>
                <a href="" class="ml-auto text-primary truncate flex items-center">
                  <i data-feather="plus" class="w-4 h-4 mr-1"></i> Add New Schedules
                </a>
              </div>
              <div class="mt-5">
                <div class="intro-x box">
                  <div class="p-5">
                    <div class="flex">
                      <i data-feather="chevron-left" class="w-5 h-5 text-slate-500"></i>
                      <div class="font-medium text-base mx-auto">April</div>
                      <i data-feather="chevron-right" class="w-5 h-5 text-slate-500"></i>
                    </div>
                    <div class="grid grid-cols-7 gap-4 mt-5 text-center">
                      <div class="font-medium">Su</div>
                      <div class="font-medium">Mo</div>
                      <div class="font-medium">Tu</div>
                      <div class="font-medium">We</div>
                      <div class="font-medium">Th</div>
                      <div class="font-medium">Fr</div>
                      <div class="font-medium">Sa</div>
                      <div v-for="day in calendarDays" :key="day.date" :class="day.class" class="py-0.5 rounded relative">
                        {{ day.date }}
                      </div>
                    </div>
                  </div>
                  <div class="border-t border-slate-200/60 p-5">
                    <div class="flex items-center" v-for="schedule in schedules" :key="schedule.id">
                      <div :class="`w-2 h-2 ${schedule.color} rounded-full mr-3`"></div>
                      <span class="truncate">{{ schedule.title }}</span>
                      <span class="font-medium xl:ml-auto">{{ schedule.date }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- END: Schedules -->
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DashboardLayout from '../../components/Layout/DashboardLayout.vue'


// Dummy data matching the template
const bestSellers = ref([
  { 
    id: 1, 
    name: 'Kevin Spacey', 
    avatar: '/assets/images/profile-12.jpg', 
    date: '24 July 2022',
    sales: 137
  },
  { 
    id: 2, 
    name: 'Johnny Depp', 
    avatar: '/assets/images/profile-2.jpg', 
    date: '10 October 2020',
    sales: 137
  },
  { 
    id: 3, 
    name: 'Tom Cruise', 
    avatar: '/assets/images/profile-13.jpg', 
    date: '10 April 2022',
    sales: 137
  },
  { 
    id: 4, 
    name: 'Leonardo DiCaprio', 
    avatar: '/assets/images/profile-10.jpg', 
    date: '13 November 2021',
    sales: 137
  }
])

const topProducts = ref([
  {
    id: 1,
    name: 'Samsung Q90 QLED TV',
    category: 'Electronic',
    stock: 50,
    status: 'Inactive',
    images: [
      { src: '/assets/images/preview-15.jpg', title: 'Uploaded at 24 July 2022' },
      { src: '/assets/images/preview-15.jpg', title: 'Uploaded at 24 December 2021' },
      { src: '/assets/images/preview-10.jpg', title: 'Uploaded at 21 July 2021' }
    ]
  },
  {
    id: 2,
    name: 'Dell XPS 13',
    category: 'PC & Laptop',
    stock: 75,
    status: 'Active',
    images: [
      { src: '/assets/images/preview-3.jpg', title: 'Uploaded at 10 October 2020' },
      { src: '/assets/images/preview-2.jpg', title: 'Uploaded at 23 August 2021' },
      { src: '/assets/images/preview-5.jpg', title: 'Uploaded at 4 February 2021' }
    ]
  },
  {
    id: 3,
    name: 'Samsung Galaxy S20 Ultra',
    category: 'Smartphone & Tablet',
    stock: 57,
    status: 'Active',
    images: [
      { src: '/assets/images/preview-2.jpg', title: 'Uploaded at 13 November 2021' },
      { src: '/assets/images/preview-1.jpg', title: 'Uploaded at 20 May 2022' },
      { src: '/assets/images/preview-6.jpg', title: 'Uploaded at 9 March 2021' }
    ]
  }
])

const transactions = ref([
  { id: 1, name: 'Kevin Spacey', avatar: '/assets/images/profile-12.jpg', date: '24 July 2022', amount: -63 },
  { id: 2, name: 'Johnny Depp', avatar: '/assets/images/profile-2.jpg', date: '10 October 2020', amount: 27 },
  { id: 3, name: 'Tom Cruise', avatar: '/assets/images/profile-13.jpg', date: '10 April 2022', amount: -42 },
  { id: 4, name: 'Leonardo DiCaprio', avatar: '/assets/images/profile-10.jpg', date: '13 November 2021', amount: 155 },
  { id: 5, name: 'Sylvester Stallone', avatar: '/assets/images/profile-2.jpg', date: '31 January 2022', amount: 217 }
])

const recentActivities = ref([
  { 
    id: 1, 
    name: 'Leonardo DiCaprio', 
    avatar: '/assets/images/profile-14.jpg',
    time: '07:00 PM',
    description: 'Has joined the team'
  },
  { 
    id: 2, 
    name: 'Russell Crowe', 
    avatar: '/assets/images/profile-3.jpg',
    time: '07:00 PM',
    description: 'Added 3 new photos'
  },
  { 
    id: 3, 
    name: 'Denzel Washington', 
    avatar: '/assets/images/profile-14.jpg',
    time: '07:00 PM',
    description: 'Has changed Apple MacBook Pro 13 price and description'
  },
  { 
    id: 4, 
    name: 'Morgan Freeman', 
    avatar: '/assets/images/profile-8.jpg',
    time: '07:00 PM',
    description: 'Has changed Nikon Z6 description'
  }
])

const importantNotes = ref([
  {
    id: 1,
    title: 'Lorem Ipsum is simply dummy text',
    content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s.',
    date: '20 Hours ago'
  },
  {
    id: 2,
    title: 'Lorem Ipsum is simply dummy text',
    content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s.',
    date: '20 Hours ago'
  },
  {
    id: 3,
    title: 'Lorem Ipsum is simply dummy text',
    content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s.',
    date: '20 Hours ago'
  }
])

const schedules = ref([
  { id: 1, title: 'UI/UX Workshop', date: '23th', color: 'bg-pending' },
  { id: 2, title: 'VueJs Frontend Development', date: '10th', color: 'bg-primary' },
  { id: 3, title: 'Laravel Rest API', date: '31th', color: 'bg-warning' }
])

const calendarDays = ref([
  { date: 29, class: 'text-slate-500' },
  { date: 30, class: 'text-slate-500' },
  { date: 31, class: 'text-slate-500' },
  { date: 1, class: '' },
  { date: 2, class: '' },
  { date: 3, class: '' },
  { date: 4, class: '' },
  { date: 5, class: '' },
  { date: 6, class: 'bg-success/20 dark:bg-success/30' },
  { date: 7, class: '' },
  { date: 8, class: 'bg-primary text-white' },
  { date: 9, class: '' },
  { date: 10, class: '' },
  { date: 11, class: '' },
  { date: 12, class: '' },
  { date: 13, class: '' },
  { date: 14, class: '' },
  { date: 15, class: '' },
  { date: 16, class: '' },
  { date: 17, class: '' },
  { date: 18, class: '' },
  { date: 19, class: '' },
  { date: 20, class: '' },
  { date: 21, class: '' },
  { date: 22, class: '' },
  { date: 23, class: 'bg-pending/20 dark:bg-pending/30' },
  { date: 24, class: '' },
  { date: 25, class: '' },
  { date: 26, class: '' },
  { date: 27, class: 'bg-primary/10 dark:bg-primary/50' },
  { date: 28, class: '' },
  { date: 29, class: '' },
  { date: 30, class: '' },
  { date: 1, class: 'text-slate-500' },
  { date: 2, class: 'text-slate-500' },
  { date: 3, class: 'text-slate-500' },
  { date: 4, class: 'text-slate-500' },
  { date: 5, class: 'text-slate-500' },
  { date: 6, class: 'text-slate-500' },
  { date: 7, class: 'text-slate-500' },
  { date: 8, class: 'text-slate-500' },
  { date: 9, class: 'text-slate-500' }
])

const currentNoteIndex = ref(0)

// Methods
const refreshData = () => {
  console.log('Refreshing dashboard data...')
  // Implement data refresh logic
}

// Lifecycle
onMounted(() => {
  console.log('Dashboard mounted')
  // Initialize feather icons if needed
})
</script>

<style scoped>
/* Dashboard specific styles */
.report-box__icon {
  width: 2rem;
  height: 2rem;
}

.divider-dotted {
  border-top: 1px dotted #e2e8f0;
}

.report-box__indicator {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-weight: 500;
}

.table-striped tbody tr:nth-child(odd) {
  background-color: rgba(0, 0, 0, 0.02);
}
</style>
