// // src/app/gastos/_components/CalendarView.tsx

// "use client";

// import { DayPicker, type DayProps } from "react-day-picker";
// import "react-day-picker/dist/style.css";
// import { format, isValid } from "date-fns";
// import { es } from "date-fns/locale";
// import type { GastoConDetalles } from "@/interfaces";

// interface Props {
//   gastos: GastoConDetalles[];
//   onEdit: (gasto: GastoConDetalles) => void;
// }

// // 1. Convertimos 'renderDay' en un componente con nombre propio para mayor claridad.
// //    Recibe 'props' de tipo DayProps.
// function CustomDay(props: DayProps) {
//   // Extraemos las propiedades que necesitamos y el resto (tdProps) se lo pasaremos al <td>
//   const { date, displayMonth, ...tdProps } = props;

//   // Aquí va la misma lógica que ya tenías para buscar los gastos
//   const diaStr = format(date, "yyyy-MM-dd");
//   // Nota: Necesitarías pasar 'gastosPorDia' a este componente o tener acceso a 'gastos'
//   // Para este ejemplo, asumiremos que 'gastos' está disponible en este scope.
//   // La forma más limpia sería definir 'gastosPorDia' fuera y usarlo aquí.
//   const gastosDelDia = gastosPorDia[diaStr]; // Asegúrate de que gastosPorDia esté accesible aquí

//   // 2. El elemento raíz que devolvemos es un <td>.
//   //    Usamos el operador "spread" ({...tdProps}) para pasar todas las propiedades
//   //    necesarias (como clases, roles de accesibilidad, etc.) que DayPicker le da.
//   return (
//     <td {...tdProps}>
//       {/* 3. TU CÓDIGO PERSONALIZADO (el div) AHORA VA DENTRO DEL <td> */}
//       <div className="relative flex flex-col h-24 w-full p-1 text-sm">
//         <span className="self-end">{format(date, "d")}</span>
//         {gastosDelDia && (
//           <div className="mt-1 space-y-1 overflow-y-auto">
//             {gastosDelDia.map((gasto) => (
//               <div
//                 key={gasto.id}
//                 onClick={() => onEdit(gasto)} // onEdit debe ser accesible también
//                 className="bg-blue-50 text-blue-800 rounded px-1.5 py-0.5 text-xs truncate cursor-pointer hover:bg-blue-100"
//                 title={`${gasto.conceptos?.nombre}: $${gasto.monto}`}
//               >
//                 ${gasto.monto.toLocaleString("en-US")}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </td>
//   );
// }

// export function CalendarView({ gastos, onEdit }: Props) {
//   const gastosPorDia = gastos.reduce((acc, gasto) => {
//     const dia = gasto.fecha_del_gasto;
//     if (!acc[dia]) {
//       acc[dia] = [];
//     }
//     acc[dia].push(gasto);
//     return acc;
//   }, {} as Record<string, GastoConDetalles[]>);

//   // Pasamos las props necesarias a nuestro componente CustomDay.
//   // DayPicker se encargará de llamar a CustomDay para cada día del calendario.
//   const DayComponentWithProps = (props: DayProps) => (
//     <CustomDay
//       {...props}
//       // Hacemos que 'gastosPorDia' y 'onEdit' estén disponibles dentro de CustomDay
//       // Esta es una forma de pasar datos adicionales a tu componente de día personalizado
//       gastosPorDia={gastosPorDia}
//       onEdit={onEdit}
//     />
//   );

//   // La forma anterior de definir CustomDay también funciona, pero requiere que las variables
//   // como 'gastosPorDia' y 'onEdit' estén en el scope superior.
//   // Separar el componente como se muestra arriba es más limpio.
//   // Sin embargo, para una solución más simple, puedes mantener la definición anidada.

//   return (
//     <div className="bg-white p-2 sm:p-4 rounded-lg shadow-md">
//       <DayPicker
//         mode="single"
//         locale={es}
//         components={{
//           // Usamos nuestro componente personalizado que ahora devuelve un <td>
//           Day: (props) => {
//             if (!props.day.date || !isValid(props.day.date)) {
//               // Renderiza una celda vacía y segura.
//               return <td></td>;
//             }
//             // Esta es una forma más directa de mantener todo en el mismo scope
//             const diaStr = format(props.day.date, "yyyy-MM-dd");
//             const gastosDelDia = gastosPorDia[diaStr];
//             const { day, displayMonth, ...tdProps } = props;

//             return (
//               <td {...tdProps}>
//                 <div className="relative flex flex-col h-24 w-full p-1 text-sm">
//                   {/* <span className="self-end">{format(date, "d")}</span> */}
//                   <span className="self-end">{day.date.getDate()}</span>
//                   {gastosDelDia && (
//                     <div className="mt-1 space-y-1 overflow-y-auto">
//                       {gastosDelDia.map((gasto) => (
//                         <div
//                           key={gasto.id}
//                           onClick={() => onEdit(gasto)}
//                           className="bg-blue-50 text-blue-800 rounded px-1.5 py-0.5 text-xs truncate cursor-pointer hover:bg-blue-100"
//                           title={`${gasto.conceptos?.nombre}: $${gasto.monto}`}
//                         >
//                           ${gasto.monto.toLocaleString("en-US")}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </td>
//             );
//           },
//         }}
//         classNames={{
//           // ✅ Ajusta el ancho de las celdas aquí también
//           day: "h-24 w-full align-top border",
//           table: "w-full border-collapse",
//           head_cell: "text-xs font-semibold text-gray-500",
//         }}
//       />
//     </div>
//   );
// }
