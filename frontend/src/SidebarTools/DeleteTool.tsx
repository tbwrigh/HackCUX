import './../App.css'

function DeleteTool() {
  return (
    <>
      <button className="inline-block w-18 h-18 p-2 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded">
        <img src="image.png" alt="Delete" className="w-full h-full object-cover rounded"></img>
      </button>
    </>
  )
}

export default DeleteTool