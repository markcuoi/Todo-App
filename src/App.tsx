import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { ToDoColumn } from "./components/columns/ToDo";
import { InProgressColumn } from "./components/columns/InProgress";
import { DoneColumn } from "./components/columns/Done";
import { useDispatch, useSelector } from "react-redux";

import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { todoSlice as todo } from "./redux/slice/todo";
import { inProgressSlice as inProgress } from "./redux/slice/inProgress";
import { doneSlice as done } from "./redux/slice/done";
import { StoreState } from "./redux/store";
import { IModel } from "./types";

type TAllSilces = "todo" | "inProgress" | "done";

function App() {
  const dispatch = useDispatch();
  const appState = useSelector((state: StoreState) => state);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const { destination, source, draggableId } = result;
    const allSlices = { todo, inProgress, done };

    if (destination.droppableId === source.droppableId) {
      dispatch(
        allSlices[destination.droppableId as TAllSilces].reorder(result)
      );
    } else {
      const [filterState] = (
        (appState as any)[source.droppableId] as IModel[]
      ).filter(({ id }) => id === draggableId);

      dispatch(allSlices[source.droppableId as TAllSilces].remove(draggableId));
      dispatch(
        allSlices[destination.droppableId as TAllSilces].update({
          ...result,
          filterState,
        })
      );
    }
  };

  return (
    <Container>
      <Typography textAlign="center" variant="h3" mt={3} mb={5}>
        ToDo APP
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        <DragDropContext onDragEnd={(res) => onDragEnd(res)}>
          <Grid item md={4}>
            <ToDoColumn />
          </Grid>
          <Grid item md={4}>
            <InProgressColumn />
          </Grid>
          <Grid item md={4}>
            <DoneColumn />
          </Grid>
        </DragDropContext>
      </Grid>
    </Container>
  );
}

export default App;
