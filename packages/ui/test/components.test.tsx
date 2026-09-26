import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";
import {
  Button,
  Combobox,
  DataTableAdvanced,
  DatePicker,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  LabeledField,
  NumberField,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../src";

describe("Button", () => {
  it("tıklamayı iletir; disabled iken iletmez", async () => {
    const onClick = vi.fn();
    const { rerender } = render(<Button onClick={onClick}>Kaydet</Button>);
    await userEvent.click(screen.getByRole("button", { name: "Kaydet" }));
    expect(onClick).toHaveBeenCalledTimes(1);
    rerender(<Button onClick={onClick} disabled>Kaydet</Button>);
    await userEvent.click(screen.getByRole("button", { name: "Kaydet" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("asChild ile alt öğeyi (link) render eder, sınıfları aktarır", () => {
    render(
      <Button asChild variant="outline">
        <a href="/profil">Profil</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Profil" });
    expect(link).toHaveAttribute("href", "/profil");
    expect(link.className).toMatch(/border/);
  });

  it("ref iletir ve klavye ile odaklanabilir", async () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Odak</Button>);
    await userEvent.tab();
    expect(ref.current).toHaveFocus();
  });
});

describe("Dialog", () => {
  it("tetikleyiciyle açılır, odağı içeri taşır, Escape ile kapanır ve odağı geri verir", async () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Aç</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Başlık</DialogTitle>
          <DialogDescription>Açıklama</DialogDescription>
          <Input aria-label="Ad" />
        </DialogContent>
      </Dialog>,
    );
    const trigger = screen.getByRole("button", { name: "Aç" });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveAccessibleName("Başlık");
    expect(dialog).toHaveAccessibleDescription("Açıklama");
    expect(dialog.contains(document.activeElement)).toBe(true);
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });
});

describe("Tabs", () => {
  it("ok tuşlarıyla sekmeler arasında gezinir ve içerik değişir", async () => {
    render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">Birinci</TabsTrigger>
          <TabsTrigger value="b">İkinci</TabsTrigger>
        </TabsList>
        <TabsContent value="a">A içeriği</TabsContent>
        <TabsContent value="b">B içeriği</TabsContent>
      </Tabs>,
    );
    expect(screen.getByRole("tabpanel")).toHaveTextContent("A içeriği");
    await userEvent.click(screen.getByRole("tab", { name: "Birinci" }));
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "İkinci" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("B içeriği");
  });
});

describe("Select", () => {
  it("seçenek seçilince değer değişir", async () => {
    const onValueChange = vi.fn();
    render(
      <Select onValueChange={onValueChange}>
        <SelectTrigger aria-label="Şehir">
          <SelectValue placeholder="Şehir seçin" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ist">İstanbul</SelectItem>
          <SelectItem value="ank">Ankara</SelectItem>
        </SelectContent>
      </Select>,
    );
    const trigger = screen.getByRole("combobox", { name: "Şehir" });
    await userEvent.click(trigger);
    await userEvent.click(await screen.findByRole("option", { name: "Ankara" }));
    expect(onValueChange).toHaveBeenCalledWith("ank");
    expect(trigger).toHaveTextContent("Ankara");
  });
});

describe("Combobox", () => {
  const options = [
    { value: "ist", label: "İstanbul" },
    { value: "izm", label: "İzmir" },
    { value: "ank", label: "Ankara" },
  ];

  it("arama ile filtreler ve seçimi bildirir", async () => {
    const onValueChange = vi.fn();
    render(<Combobox options={options} placeholder="Şehir seçin" onValueChange={onValueChange} />);
    const trigger = screen.getByRole("combobox");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    const search = await screen.findByPlaceholderText("Ara…");
    expect(search).toHaveFocus();
    await userEvent.type(search, "Ank");
    const listbox = await screen.findByRole("listbox");
    await waitFor(() => expect(within(listbox).queryByText("İstanbul")).not.toBeInTheDocument());
    await userEvent.click(within(listbox).getByText("Ankara"));
    expect(onValueChange).toHaveBeenCalledWith("ank");
    expect(screen.getByRole("combobox")).toHaveTextContent("Ankara");
  });

  it("eşleşme yoksa boş mesajı gösterir", async () => {
    render(<Combobox options={options} emptyMessage="Sonuç yok" />);
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.type(await screen.findByPlaceholderText("Ara…"), "qqxw");
    expect(await screen.findByText("Sonuç yok")).toBeInTheDocument();
  });
});

describe("NumberField", () => {
  it("artır/azalt butonları ve min/max sınırı", async () => {
    const onValueChange = vi.fn();
    render(<NumberField aria-label="Adet" defaultValue={1} min={0} max={2} onValueChange={onValueChange} />);
    const input = screen.getByRole("spinbutton", { name: "Adet" });
    await userEvent.click(screen.getByRole("button", { name: "Artır" }));
    expect(onValueChange).toHaveBeenLastCalledWith(2);
    expect(screen.getByRole("button", { name: "Artır" })).toBeDisabled();
    await userEvent.click(screen.getByRole("button", { name: "Azalt" }));
    await userEvent.click(screen.getByRole("button", { name: "Azalt" }));
    expect(onValueChange).toHaveBeenLastCalledWith(0);
    expect(input).toHaveAttribute("aria-valuenow", "0");
  });

  it("klavye ArrowUp/ArrowDown ve yazıp blur'da sınıra kırpma", async () => {
    const onValueChange = vi.fn();
    render(<NumberField aria-label="Tutar" defaultValue={5} min={0} max={10} onValueChange={onValueChange} />);
    const input = screen.getByRole("spinbutton", { name: "Tutar" });
    await userEvent.click(input);
    await userEvent.keyboard("{ArrowUp}");
    expect(onValueChange).toHaveBeenLastCalledWith(6);
    await userEvent.keyboard("{ArrowDown}{ArrowDown}");
    expect(onValueChange).toHaveBeenLastCalledWith(4);
    await userEvent.clear(input);
    await userEvent.type(input, "99");
    await userEvent.tab();
    expect(onValueChange).toHaveBeenLastCalledWith(10);
  });
});

describe("DataTableAdvanced", () => {
  type Row = { id: string; ad: string; puan: number };
  const data: Row[] = [
    { id: "1", ad: "Ceren", puan: 70 },
    { id: "2", ad: "Ali", puan: 90 },
    { id: "3", ad: "Burak", puan: 80 },
  ];
  const columns = [
    { key: "ad", header: "Ad", accessor: (r: Row) => r.ad, sortable: true },
    { key: "puan", header: "Puan", accessor: (r: Row) => r.puan, sortable: true, sortAccessor: (r: Row) => r.puan },
  ];
  const names = () => screen.getAllByRole("row").slice(1).map((r) => within(r).getAllByRole("cell").map((c) => c.textContent).join("|"));

  it("başlığa tıklayınca artan/azalan sıralar ve aria-sort günceller", async () => {
    const onSortChange = vi.fn();
    render(<DataTableAdvanced columns={columns} data={data} rowKey={(r) => r.id} onSortChange={onSortChange} />);
    const header = screen.getByRole("columnheader", { name: /Puan/ });
    await userEvent.click(within(header).getByRole("button"));
    expect(onSortChange).toHaveBeenLastCalledWith({ key: "puan", direction: "asc" });
    expect(header).toHaveAttribute("aria-sort", "ascending");
    expect(names().map((n) => n.split("|").at(-1))).toEqual(["70", "80", "90"]);
    await userEvent.click(within(header).getByRole("button"));
    expect(header).toHaveAttribute("aria-sort", "descending");
    expect(names().map((n) => n.split("|").at(-1))).toEqual(["90", "80", "70"]);
  });

  it("seçilebilir satırlar: tümünü seç ve tekil seçim", async () => {
    const onSelectionChange = vi.fn();
    render(
      <DataTableAdvanced columns={columns} data={data} rowKey={(r) => r.id} selectable onSelectionChange={onSelectionChange} />,
    );
    const boxes = screen.getAllByRole("checkbox");
    expect(boxes).toHaveLength(4);
    await userEvent.click(boxes[2]!);
    expect(onSelectionChange).toHaveBeenLastCalledWith(["2"]);
    await userEvent.click(boxes[0]!);
    expect(onSelectionChange.mock.lastCall?.[0]).toEqual(expect.arrayContaining(["1", "2", "3"]));
  });

  it("boş veri durumunda emptyState gösterir", () => {
    render(<DataTableAdvanced columns={columns} data={[]} rowKey={(r) => r.id} emptyState="Kayıt yok" />);
    expect(screen.getByText("Kayıt yok")).toBeInTheDocument();
  });
});

describe("Form doğrulama", () => {
  function SignupForm({ onSubmit }: { onSubmit: (v: { email: string }) => void }) {
    const form = useForm<{ email: string }>({ defaultValues: { email: "" } });
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            rules={{
              required: "E-posta zorunlu",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Geçerli bir e-posta girin" },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-posta</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Gönder</Button>
        </form>
      </Form>
    );
  }

  it("hata mesajını gösterir, alanı aria-invalid işaretler ve düzeltilince gönderir", async () => {
    const onSubmit = vi.fn();
    render(<SignupForm onSubmit={onSubmit} />);
    await userEvent.click(screen.getByRole("button", { name: "Gönder" }));
    expect(await screen.findByText("E-posta zorunlu")).toBeInTheDocument();
    const input = screen.getByLabelText("E-posta");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription(/E-posta zorunlu/);
    await userEvent.type(input, "gecersiz");
    await userEvent.click(screen.getByRole("button", { name: "Gönder" }));
    expect(await screen.findByText("Geçerli bir e-posta girin")).toBeInTheDocument();
    await userEvent.clear(input);
    await userEvent.type(input, "ozan@example.com");
    await userEvent.click(screen.getByRole("button", { name: "Gönder" }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0]![0]).toEqual({ email: "ozan@example.com" });
  });
});

describe("LabeledField", () => {
  it("etiket, ipucu ve hata metnini erişilebilir şekilde bağlar", () => {
    render(
      <LabeledField label="Telefon" htmlFor="tel" hint="Başında 0 olmadan" error="Geçersiz numara" required>
        <Input id="tel" />
      </LabeledField>,
    );
    expect(screen.getByLabelText(/Telefon/)).toHaveAttribute("id", "tel");
    expect(screen.getByText("Geçersiz numara")).toBeInTheDocument();
  });
});

describe("InputOTP", () => {
  it("rakam girişi ve tamamlanma callback'i", async () => {
    const onComplete = vi.fn();
    render(
      <InputOTP maxLength={4} onComplete={onComplete} aria-label="Doğrulama kodu">
        <InputOTPGroup>
          {[0, 1, 2, 3].map((i) => (
            <InputOTPSlot key={i} index={i} />
          ))}
        </InputOTPGroup>
      </InputOTP>,
    );
    const input = screen.getByRole("textbox");
    await userEvent.click(input);
    await userEvent.keyboard("4821");
    expect(input).toHaveValue("4821");
    expect(onComplete).toHaveBeenCalledWith("4821");
  });
});

describe("DatePicker", () => {
  it("açılır, gün seçilince onChange çağrılır ve buton etiketi güncellenir", async () => {
    const onChange = vi.fn();
    render(<DatePicker defaultValue={new Date(2026, 8, 10)} onChange={onChange} />);
    const trigger = screen.getByRole("button");
    expect(trigger).toHaveAccessibleName(/10/);
    await userEvent.click(trigger);
    const grid = await screen.findByRole("grid");
    const day15 = within(grid).getAllByRole("button").find((b) => b.textContent?.trim() === "15");
    expect(day15).toBeDefined();
    await userEvent.click(day15!);
    expect(onChange).toHaveBeenCalled();
    const picked = onChange.mock.calls.at(-1)![0] as Date;
    expect(picked.getFullYear()).toBe(2026);
    expect(picked.getMonth()).toBe(8);
    expect(picked.getDate()).toBe(15);
  });
});
