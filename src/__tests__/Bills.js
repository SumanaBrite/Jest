/**
 * @jest-environment jsdom
 */
 import "@testing-library/jest-dom";
 import { screen } from "@testing-library/dom";
 import userEvent from "@testing-library/user-event";
 import BillsUI from "../views/BillsUI.js";
 import Bills from "../containers/Bills.js";
 import { ROUTES } from "../constants/routes";
 import { localStorageMock } from "../__mocks__/localStorage.js";
 import store from "../__mocks__/store.js";
 import { bills } from "../fixtures/bills.js";
 import router from "../app/Router.js";
 import { ROUTES_PATH } from '../constants/routes.js'


describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)

    test("if bill icon in vertical layout is highlighted", async () => {
      document.body.innerHTML = `<div id="root"></div>`;
      router()
      const windowIcon = screen.getByTestId('icon-window')
      expect(windowIcon.classList.contains("active-icon")).toBeTruthy();
    })
    

    test("if error message appear if the tickets can't be displayed", () => {
      document.body.innerHTML = BillsUI({ error: "some error message" });
      expect(screen.getAllByText("Erreur")).toBeTruthy();
    })
    test("should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })
})

describe("When employee clicks on eye-icon " , () =>{
     test("Image Modal appears" , ()=> {  

      document.body.innerHTML = BillsUI({ data: bills })
        const nBills = new Bills({ document, onNavigate, firestore: null, localStorage: window.localStorage })
        nBills.handleClickIconEye = jest.fn()
        screen.getAllByTestId("icon-eye")[0].click()
        expect(nBills.handleClickIconEye).toBeCalled()
     })
     test("Then the modal should display the attached image", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const nBills = new Bills({ document, onNavigate, firestore: null, localStorage: window.localStorage })
      const iconEye = document.querySelector(`div[data-testid="icon-eye"]`)
      $.fn.modal = jest.fn()
      nBills.handleClickIconEye(iconEye)
      expect($.fn.modal).toBeCalled()
      expect(document.querySelector(".modal")).toBeTruthy()
    })
})
describe("When I click on New bill button", () => {
  it("should render NewBill page", () => {
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
    });
    const user = JSON.stringify({
      type: "Employee",
    });
    window.localStorage.setItem("user", user);
    document.body.innerHTML = BillsUI({ data: bills });
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname });
    };
    const nBills = new Bills({
      document, onNavigate, store, localStorage: window.localStorage,
    });

    const handleClickNewBill = jest.fn(nBills.handleClickNewBill);
    const newBillButton = screen.getByTestId("btn-new-bill");
    newBillButton.addEventListener("click", handleClickNewBill);
    userEvent.click(newBillButton);
    expect(handleClickNewBill).toHaveBeenCalled();
  });
});


 