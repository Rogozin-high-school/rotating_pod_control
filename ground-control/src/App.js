import './App.css';
import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Box, Button, Grid, ThemeProvider, TextField, CardMedia, Card } from '@material-ui/core';
import { createTheme } from '@material-ui/core';
import { render } from 'react-dom';

const updateValues = () => {
  alert('hey');
  // TODO: Add real time value chaneg feature
}

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      connected: false
    };

    this.theme = createTheme({
      palette: {
        type: 'dark',
      },
    });

    setInterval(() => {
      fetch('http://localhost:5000//client-connection', {
        method: 'get',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => this.setState({ connected: data['client_connected'] }))
      .catch(error => this.setState({ connected: false}));
    }, 1000);
  }

  render() {
    return (
      <ThemeProvider theme={this.theme}>
        <CssBaseline/>
        <div style={{ height: "100vh", margin: 0, padding: 0}}>
          <Box width="100%" height="100%" p={5}>
            <Grid container style={{ height: "100%" }}>
              <Grid item xs container spacing={6} direction="column" alignItems="center" style={{ paddingTop: "200px" }}>
                <Grid item>
                    <TextField id="scan_speed" label="Scan speed" disabled={!this.state.connected} ></TextField>
                </Grid>
                <Grid item>
                    <TextField id="retreat_speed" label="Retreat speed" disabled={!this.state.connected} ></TextField>
                </Grid>
                <Grid item>
                    <TextField id="steps_per_revolution" label="Steps per revolution" disabled={!this.state.connected} ></TextField>
                </Grid>
                <Grid item>
                    <TextField id="arc_size" label="Arck size" disabled={!this.state.connected} ></TextField>
                </Grid>
                <Grid item>
                  <Button id="changed" variant="contained" color="primary" disabled={!this.state.connected} onClick={updateValues} >change</Button>
                </Grid>
              </Grid>
              <Grid item xs={8}>
                <Card style={{ width: "100%", height: "100%" }}>
                  <CardMedia title="sat-image" style={{ height: "100%" }} />
                </Card>
              </Grid>
            </Grid>
          </Box>
        </div>
      </ThemeProvider>
    );
  }
}

export default App;
