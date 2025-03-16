import { useEffect, useState } from "react";
import * as si from "@icons-pack/react-simple-icons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowLeftIcon, ArrowRightIcon, LinkIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface IconPickerProps {
  icon: string;
  onIconChange: (i: string) => any;
  disabled?: boolean;
}

const mainIconsList = si as unknown as Record<string, React.ComponentType>;

export default function IconPicker({
  icon,
  onIconChange,
  disabled,
}: IconPickerProps) {
  const [search, setSearch] = useState("");
  const [currentIcon, setCurrentIcon] = useState<string | null>(null);
  const [iconList, setIconList] = useState<Record<string, React.ComponentType>>(
    {}
  );
  const [page, setPage] = useState(0);
  const [iconDialog, setIconDialog] = useState(false);

  useEffect(() => {
    if (icon in mainIconsList) {
      setCurrentIcon(icon);
    } else {
      setCurrentIcon(null);
    }
  }, [icon]);

  useEffect(() => {
    setIconList((old) => {
      let ls = Object.fromEntries(
        Object.entries(mainIconsList).filter(
          ([, val]) => typeof val !== "string"
        )
      );

      if (search !== "") {
        setPage(0);
        ls = Object.fromEntries(
          Object.entries(ls).filter(([key]) =>
            key.toLowerCase().includes(search.toLowerCase())
          )
        );
      }
      return ls;
    });
  }, [search]);

  const IconComponent = currentIcon ? mainIconsList[currentIcon] : LinkIcon;

  return (
    <Dialog open={iconDialog} onOpenChange={setIconDialog}>
      <DialogTrigger disabled={disabled}>
        <IconComponent size={21} />
      </DialogTrigger>
      <DialogContent className="h-[55vh] w-[55vw] max-w-[50vw]">
        <DialogHeader>
          <DialogTitle>Pick an icon</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col h-full">
          <Input
            className="w-full mb-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search icons..."
          />
          <div className="flex-grow overflow-y-auto min-h-0">
            <div className="grid grid-cols-5 gap-5 auto-rows-[60px] p-2 min-h-[250px]">
              {Object.entries(iconList)
                .slice(15 * page, 15 * page + 15)
                .map(([key, Icon]) => (
                  <div key={key} className="flex items-center justify-center">
                    <Icon
                      size={50}
                      className="hover:bg-accent p-3 border border-accent rounded-md cursor-pointer"
                      onClick={() => {
                        onIconChange(key);
                        setIconDialog(false);
                      }}
                    />
                  </div>
                ))}
              {Array.from({
                length: Math.max(
                  0,
                  15 -
                    Object.entries(iconList).slice(15 * page, 15 * page + 15)
                      .length
                ),
              }).map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="flex items-center justify-center"
                >
                  <div className="w-[50px] h-[50px]"></div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between items-center gap-2">
            <div className="text-sm text-gray-500">
              Page {page + 1} of {Math.ceil(Object.keys(iconList).length / 15)}
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                className="w-10 h-10 p-1"
                onClick={() => setPage((old) => Math.max(0, old - 1))}
                disabled={page === 0}
              >
                <ArrowLeftIcon size={20} />
              </Button>
              <Button
                variant="ghost"
                className="w-10 h-10 p-1"
                onClick={() => setPage((old) => old + 1)}
                disabled={15 * (page + 1) >= Object.entries(iconList).length}
              >
                <ArrowRightIcon size={20} />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
