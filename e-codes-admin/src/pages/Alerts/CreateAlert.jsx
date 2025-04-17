import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useStore } from "../../stores";
import H2 from "../../components/H2";
import Dropdown from "../../components/Dropdown";
import Button from "../../components/Button";
import SoftPanel from "../../components/SoftPanel";

const CreateAlert = ({ className }) => {
  const { locations, codes, setOnGoingAlerts, onGoingAlerts } = useStore();

  const [code, setCode] = useState(null);
  const [building, setBuilding] = useState(null);
  const [floor, setFloor] = useState(null);
  const [area, setArea] = useState(null);
  const [room, setRoom] = useState(null);
  const [drill, setDrill] = useState(false);

  useEffect(() => {
    console.log(building, floor, area, room, drill);
  }, [building, floor, area, room, drill]);

  return (
    <SoftPanel className={className}>
      {/* <div className="grid grid-cols-6 border-2 border-teal-700/60 bg-slate-50/80 gap-y-4 gap-x-1 p-4 items-center text-center rounded-sm"> */}
      <div className="col-span-1">Code:</div>
      <Dropdown
        className="bg-white col-span-2"
        items={Object.keys(codes)}
        placeholder={"code"}
        value={code}
        callback={(v) => setCode(v)}
      />

      <div className="flex items-center space-x-3 col-span-3 place-content-end">
        <span className="text-sm font-medium text-stone-700">Drill</span>
        <button
          type="button"
          className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
            drill ? "bg-teal-600" : "bg-stone-300"
          }`}
          onClick={() => setDrill(!drill)}
        >
          <span
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
              drill ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      <div className="col-span-1">Location:</div>

      {locations ? (
        <Dropdown
          className="bg-white m-0 mr-2"
          items={Object.keys(locations)}
          placeholder={"building"}
          value={building}
          callback={(v) => {
            setBuilding(v);
            setFloor(null);
            setArea(null);
            setRoom(null);
          }}
        />
      ) : (
        <div />
      )}

      {locations?.[building] ? (
        <Dropdown
          className="bg-white m-0 mr-2"
          key={`${building}-floor`}
          items={Object.keys(locations[building])}
          placeholder={"floor"}
          value={floor}
          callback={(v) => {
            setFloor(v);
            setArea(null);
            setRoom(null);
          }}
        />
      ) : (
        <div />
      )}

      {locations?.[building]?.[floor] ? (
        <Dropdown
          className="bg-white m-0 mr-2"
          key={`${building}-${floor}-area`} // ✅ force remount when building or floor changes
          items={Object.keys(locations[building][floor])}
          placeholder={"area"}
          value={area}
          callback={(v) => {
            setArea(v);
            setRoom(null);
          }}
        />
      ) : (
        <div />
      )}

      {locations?.[building]?.[floor]?.[area] ? (
        <Dropdown
          className="bg-white m-0 mr-2"
          key={`${building}-${floor}-${area}-room`}
          items={Object.keys(locations[building][floor][area])}
          placeholder={"room"}
          value={room}
          callback={(v) => {
            setRoom(v);
          }}
        />
      ) : (
        <div />
      )}

      <Button
        onClick={() => {
          setBuilding(null);
          setFloor(null);
          setArea(null);
          setRoom(null);
        }}
      >
        Clear
      </Button>

      <div className="col-span-6 pt-4 text-center">
        <span className="text-stone-800/80 py-1 px-4 rounded-sm">
          Buidling <b>{building}</b>, Floor <b>{floor}</b>, Area <b>{area}</b>,
          Room <b>{room}</b>
        </span>

        {/* Building: <span className="font-bold">{building}</span>
        Floor: <span className="font-bold">{floor}</span>
        Area: <span className="font-bold">{area}</span>
        Room: <span className="font-bold">{room}</span> */}
      </div>

      {code && building && floor && area && room && (
        <Button
          className="col-span-6 bg-amber-500/30 hover:bg-amber-500 font-semibold"
          onClick={() => {
            let newOAlerts = structuredClone(onGoingAlerts);
            console.log(newOAlerts);
            newOAlerts.push({
              id: Math.random() * 1000,
              code: "Blue",
              initiated: "10:23 (3.5 hr ago)",
              location: { building: "A", floor: "0", room: "1" },
            });
            console.log(newOAlerts);
            setOnGoingAlerts([...newOAlerts]);
          }}
        >
          Create Alert
        </Button>
      )}
      {/* </div> */}
    </SoftPanel>
  );
};

export default CreateAlert;
