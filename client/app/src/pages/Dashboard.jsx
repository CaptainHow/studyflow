export function Dashboard() {
  return (<>
    <div className="flex flex-col">
      <div>Dashboard</div>
      <div className="flex flex-row">
        <div className="flex">
          left
        </div>
        <div className="flex">
          right
        </div>
      </div>
      <div>
        <div className="flex flex-row justify-between">
          <div>Tasks</div>
          <div className="flex flex-row">
            <div>Filter</div>
            <div>Search</div>
          </div>
        </div>
      </div>
    </div>
  </>)
}
