/**
 * @jest-environment jsdom
 */
import { fireEvent, screen, waitFor } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import Router from "../app/Router.js";
import { localStorageMock } from "../__mocks__/localStorage.js"
import store from "../__mocks__/store.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import mockStore from "../__mocks__/store"


describe("Given I am connected as an employee", () => {
  const onNavigate = (pathname) => {
    document.body.innerHTML = ROUTES({ pathname })
  }
  Object.defineProperty(window, 'location', { value: localStorageMock })
  window.localStorage.setItem('user', JSON.stringify({ type: 'Employee', email: 'a@a' }))

  describe("When I am on NewBill Page", () => {
    document.body.innerHTML = NewBillUI()
    const newBill = new NewBill({ document, onNavigate, store, localStorage: window.localStorage })
    test("New Bill page is rendered", () => {
      const form = document.querySelector("form")
      expect(screen.getAllByText("Envoyer une note de frais")).toBeTruthy()
      expect(form).toBeTruthy()
    })
  })

  describe("When I'm on NewBill Page", () => {
    describe("when I upload a image file", () => {
      test("file handler should show a file", () => {
        document.body.innerHTML = NewBillUI()
        const newBill = new NewBill({ document, onNavigate, store, localStorage: window.localStorage })
        const handleChangeFile = jest.fn(() => newBill.handleChangeFile)
        const inputFile = screen.getByTestId("file")
        inputFile.addEventListener("change", handleChangeFile)
        fireEvent.change(inputFile)
        fireEvent.change(inputFile, {
          target: {
            files: [new File(["test.doc"], "test.doc", { type: "test/doc" })],
          }
        })
        const numberOfFile = screen.getByTestId("file").files.length
        expect(numberOfFile).toEqual(1)
        expect(handleChangeFile).toBeCalled()
      })
    })
    
    describe("And I upload a unauthorised format file", () => {
      test("Error massage should be displayed", () => {
        document.body.innerHTML = NewBillUI()
        const newBill = new NewBill({ document, onNavigate, store, localStorage: window.localStorage })
        const handleChangeFile = jest.fn(() => newBill.handleChangeFile)
        const inputFile = screen.getByTestId("file")
        inputFile.addEventListener("change", handleChangeFile)
        fireEvent.change(inputFile)
        expect(handleChangeFile).toHaveBeenCalled()
        expect(document.querySelector(".errorImage").style.display).toBe("block")
      })
    })
    
    describe("And I submit a valid bill form", () => {
      test('then a bill is added to the list', () => {
        document.body.innerHTML = NewBillUI()
        const newBill = new NewBill({ document, onNavigate, store, localStorage: window.localStorage })
        const submit = screen.getByTestId('form-new-bill')
        const handleSubmit = jest.fn((e) => newBill.handleSubmit(e))
        submit.addEventListener('click', handleSubmit)
        fireEvent.click(submit)
        expect(handleSubmit).toHaveBeenCalled()
      })
    })

  })

})

