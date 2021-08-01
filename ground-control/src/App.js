import './App.css';
import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Box, Button, Grid, ThemeProvider, TextField, CardMedia, Card, createTheme } from '@material-ui/core';

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      connected: false,
      satProps: {
        scanSpeed: 0,
        retreatSpeed: 0,
        stepsPerRevolution: 0,
        arcSize: 0
      }
    };

    this.theme = createTheme({
      palette: {
        type: 'dark',
      },
    });
    
    setInterval(() => {
      fetch('http://localhost:5000/client-connection', {
        method: 'get',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => this.setState({ ...this.state, connected: data['client_connected'] }))
      .catch(error => this.setState({ ...this.state, connected: false}));
    }, 5000);
  }

  updateScanSpeed = (e) => {
    this.setState({ 
      ...this.state, 
      satProps: { 
        ...this.state.satProps, 
        scanSpeed: e.target.value 
      }
    });
  }
  
  updateRetreatSpeed = (e) => {
    this.setState({ 
      ...this.state, 
      satProps: { 
        ...this.state.satProps, 
        retreatSpeed: e.target.value 
      }
    });
  }
  
  updateStepsPerRevolution = (e) => {
    this.setState({ 
      ...this.state, 
      satProps: { 
        ...this.state.satProps, 
        stepsPerRevolution: e.target.value 
      }
    });
  }

  updateArcSize = (e) => {
    this.setState({ 
      ...this.state, 
      satProps: { 
        ...this.state.satProps, 
        arcSize: e.target.value 
      }
    });
  }

  updateValues = () => {
    fetch('http://localhost:5000/update-values', {
      method: 'post',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state.satProps)
    })
    .then(response => response.ok ? alert('ok') : alert('error'))
    .catch(error => alert(error));
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
                    <TextField id="scan_speed" label="Scan speed" disabled={!this.state.connected} onChange={this.updateScanSpeed}></TextField>
                </Grid>
                <Grid item>
                    <TextField id="retreat_speed" label="Retreat speed" disabled={!this.state.connected} onChange={this.updateRetreatSpeed}></TextField>
                </Grid>
                <Grid item>
                    <TextField id="steps_per_revolution" label="Steps per revolution" disabled={!this.state.connected} onChange={this.updateStepsPerRevolution}></TextField>
                </Grid>
                <Grid item>
                    <TextField id="arc_size" label="Arck size" disabled={!this.state.connected} onChange={this.updateArcSize}></TextField>
                </Grid>
                <Grid item>
                  <Button id="changed" variant="contained" color="primary" disabled={!this.state.connected} onClick={this.updateValues} >change</Button>
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
