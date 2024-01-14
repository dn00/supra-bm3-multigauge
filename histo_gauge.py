from kivy.uix.boxlayout import BoxLayout
from kivy.uix.floatlayout import FloatLayout
from kivy.uix.label import Label
from kivy.graphics import Color, Line, Ellipse
from kivy.clock import Clock
from kivy.uix.widget import Widget
from collections import deque
import time
from kivy.properties import NumericProperty, StringProperty, BooleanProperty, ListProperty, ReferenceListProperty

from kivymd.uix import floatlayout
class DataBox(BoxLayout):
    current_value = NumericProperty(15)  # Example current value
    font_name = StringProperty()
    highest_value = NumericProperty(0)  # New property for highest value
    lowest_value = NumericProperty(100)  # New property for lowest value
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        
        self.orientation = 'vertical'

        # Create labels
        self.value_label = Label(text=str(self.current_value), size_hint_y=None, height=60, font_size=32)  # Larger font size


        # Value label (to the right of the sublabels)
        value_box = BoxLayout(orientation='horizontal')
        # value_box.add_widget(Label())  # Empty label for spacing
        value_box.add_widget(self.value_label)
        self.add_widget(value_box)
        # New labels for highest and lowest values
        # self.highest_label = Label(text=str(self.highest_value), color=[0, 1, 0, 1])  # Green color for highest
        # self.lowest_label = Label(text=str(self.lowest_value), color=[1, 0, 0, 1])  # Red color for lowest
        # self.add_widget(self.highest_label)
        # self.add_widget(self.lowest_label)

        # New method bindings
        self.bind(highest_value=self.update_highest_label)
        self.bind(lowest_value=self.update_lowest_label)
        # Bind properties to update labels
        self.bind(current_value=self.update_value_label)
        self.bind(font_name=self.on_font_name)
        
    def update_highest_label(self, instance, value):
        self.highest_label.text = f"↑ {value}"  # Up arrow for highest

    def update_lowest_label(self, instance, value):
        self.lowest_label.text = f"↓ {value}"  # Down arrow for lowest

    def on_font_name(self, instance, value):
        self.value_label.font_name = value

    def update_value_label(self, instance, value):
        self.value_label.text = str(value)

class MultiLineLabel(BoxLayout):
    chars_per_line = NumericProperty(3)  # Default value
    text = StringProperty('')  # Text property
    font_name = StringProperty()
    font_size = NumericProperty(24)
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.label = Label(bold=True)  # Internal label
        self.add_widget(self.label)
        self.bind(text=self.update_text, chars_per_line=self.update_text)
        self.bind(font_name=self.on_font_name)
        self.bind(font_size=self.on_font_size)
        
    def on_font_size(self, instance, value):
        self.label.font_size = value
    
    def on_font_name(self, instance, value):
        self.label.font_name = value
    def update_text(self, *args):
        formatted_text = self.split_text(self.text, self.chars_per_line)
        self.label.text = formatted_text

    @staticmethod
    def split_text(text, chars_per_line):
        lines = [text[i:i+chars_per_line] for i in range(0, len(text), chars_per_line)]
        return '\n'.join(lines)
    
class HistoGauge(BoxLayout):
    min_value = NumericProperty(0)
    max_value = NumericProperty(100)
    normal_value = NumericProperty()
    time_window = NumericProperty(60)
    value = NumericProperty(0)
    label_text = StringProperty("")
    label_size = NumericProperty(24)
    font_name = StringProperty()
    max_line_pos = NumericProperty(0)
    min_line_pos = NumericProperty(0)
    unit_text = StringProperty("") 
    
    # (value, timestamp)
    highest_value = 0
    lowest_value = 0
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.orientation = 'horizontal'  # Assuming a horizontal layout
        self.history_values = deque()
        self.current_value = Label()  # Large text for current value
        
        # Container for histogram and label
        # self.overlay_container = FloatLayout(size_hint_x=1)
        # self.add_widget(self.overlay_container)
        self.label_box = MultiLineLabel(size_hint=(0.3, 1), orientation='vertical')
        self.add_widget(self.label_box)
        # Histogram container (inside overlay container)
        self.histogram_container = BoxLayout(size_hint=(1, 1), pos_hint={'x': 0, 'y': 0})
        self.add_widget(self.histogram_container)

        # Current value label (inside histogram container)
        self.current_value = Label(size_hint_x=1)
        self.histogram_container.add_widget(self.current_value)

        # # Overlay label (on top of the histogram)
        # self.overlay_label = Label(size_hint=(None, 0.4),
        #                            text=self.label_text, font_size=18,
        #                            halign='left', valign='middle',
        #                            pos_hint={'x': 0.01, 'top': .96})  # Adjust pos_hint as needed
        # self.overlay_container.add_widget(self.overlay_label)

   

        # Current value label
        self.current_value = Label(size_hint_x=1)
        self.histogram_container.add_widget(self.current_value)

 
        # Create a BoxLayout for labels
        self.labels_layout = BoxLayout(orientation='vertical', size_hint=(None, 1))
        self.labels_layout.width = 30  # Set a fixed width for labels
        self.add_widget(self.labels_layout)

        # Create min and max labels
        self.min_label = Label(size_hint_y=None, height=20, text = str(self.min_value), font_size=10)
        self.max_label = Label(size_hint_y=None, height=20, text = str(self.max_value), font_size=10)
        self.mid_unit_label = Label(size_hint_y=None, height=20, text = str(self.unit_text), font_size=12)
    
        # Add labels to the labels layout
        self.labels_layout.add_widget(self.max_label)
        self.labels_layout.add_widget(self.mid_unit_label)  # Stretchy widget to push labels to ends
        self.labels_layout.add_widget(self.min_label)
        
        # self.data_box = DataBox(size_hint=(0.1, 1), orientation='vertical',)
        # self.add_widget(self.data_box)
        
        self.highest_lowest_layout = BoxLayout(orientation='vertical', size_hint=(None, 1), width=80)
        
        self.highest_label = Label(size_hint_y=None, height=20, text = str(self.highest_value), font_size=10, color=[0, 1, 0, 1])
        self.lowest_label = Label(size_hint_y=None, height=20, text = str(self.lowest_value), font_size=10, color=[1, 0, 0, 1])
        self.current_value_label = Label(size_hint_y=None, height=20, text = str(self.value), font_size=28)

        self.highest_lowest_layout.add_widget(self.highest_label)
        self.highest_lowest_layout.add_widget(self.current_value_label)
        self.highest_lowest_layout.add_widget(self.lowest_label)
        self.add_widget(self.highest_lowest_layout)
        
        Clock.schedule_interval(self.update_histogram, 0.5)
        self.bind(value=self.on_value)
        self.bind(label_text=self.on_label_text)
        self.bind(font_name=self.on_font_name)
        self.bind(label_size=self.on_label_size)
        self.bind(unit_text=self.on_unit_text)
        self.bind(min_value=self.on_min_value)
        self.bind(max_value=self.on_max_value)
        # self.bind(height=self.on_height)
        
    def on_min_value(self, instance, value):
        self.min_label.text = str(value)
    
    def on_max_value(self, instance, value):
        self.max_label.text = str(value)

    def on_unit_text(self, instance, value):
        self.mid_unit_label.text = value
    def on_label_size(self, instance, value):
        self.label_box.font_size = value
        
    def on_label_text(self, instance, value):
        self.label_box.text = value
        # self.self.label_box.width = len(value) * 14  # Adjust width as needed
    
    def on_font_name(self, instance, value):
        self.label_box.font_name = value
        self.current_value.font_name = value
        self.min_label.font_name = value
        self.max_label.font_name = value
        self.highest_label.font_name = value
        self.lowest_label.font_name = value
        self.current_value_label.font_name = value
        # self.data_box.font_name = value
    
    def draw_separation_line(self, y_pos, label_type):
        """ Draw a separation line at the given y position and move the corresponding label. """
        line_width = 1
        Color(1, 1, 1, 0.3)
        Line(points=[self.histogram_container.x, y_pos, self.histogram_container.x + self.histogram_container.width, y_pos], width=line_width)

        # # Move the corresponding label
        # if label_type == 'max':
        #     self.max_label.y = y_pos - self.max_label.height / 2
        # elif label_type == 'min':
        #     self.min_label.y = y_pos - self.min_label.height / 2

    def on_size(self, instance, value):
        self.draw_separation_line(self.y + self.height, "max")  # Top line
        self.draw_separation_line(self.y, "min")
        # self.data_box.height = self.height
        self.label_box.height = self.height

    def on_value(self, instance, value):
        self.current_value.text = str(value)  # Update text in real-time
        self.current_value_label.text = str(value)
    def update_histogram(self, dt):
        current_time = time.time()

        # Add latest value to history for histogram
        if self.current_value.text:
            self.history_values.append((float(self.current_value.text), current_time))

        # Remove outdated values
        while self.history_values and current_time - self.history_values[0][1] > self.time_window:
            self.history_values.popleft()

        self.draw_histogram()

    def draw_histogram(self):
        self.histogram_container.canvas.clear()
        with self.histogram_container.canvas:
            # Set the color for the histogram dots/lines
            # Draw the top line at the height of the widget
            self.min_label.y = self.normalize_y(self.min_value) - 12
            self.max_label.y = self.normalize_y(self.max_value) - 12
            
            self.highest_label.y = self.normalize_y(self.max_value) - 12
            self.lowest_label.y = self.normalize_y(self.min_value) - 12
            self.draw_separation_line(self.top, "max")  # Adjusted top line
            # Draw the bottom line at the bottom of the widget
            self.draw_separation_line(self.y, "min")            # Bottom line
            # ... rest of the drawing code ... 
            # Draw each point in the history
            Color(1, 1, 1, 1)  # White color, for example

            for value, timestamp in self.history_values:
                # Normalize the value and timestamp within the range and time window
                x_pos = self.normalize_x(timestamp)
                y_pos = self.normalize_y(value)

                # Draw a dot or a line for the data point
                self.draw_data_point(x_pos, y_pos)

            # Optionally, draw the normal line
            if self.normal_value:
                self.draw_normal_line()
            
            # handle highest and lowest values efficiently
            if self.history_values:
                self.highest_value = max(self.history_values)[0]
                self.lowest_value = min(self.history_values)[0]
                self.highest_label.text = f"{self.highest_value}"  # Up arrow for highest
                self.lowest_label.text = f"{self.lowest_value}"  # Down arrow for lowest
                
    def normalize_x(self, timestamp):
        """ Normalize the x position based on the timestamp. """
        current_time = time.time()
        time_diff = current_time - timestamp
        x_pos = (self.histogram_container.width - (time_diff / self.time_window) * self.histogram_container.width) + self.histogram_container.x
        return x_pos

    def normalize_y(self, value):
        """ Normalize the y position based on the value. """
        value_range = self.max_value - self.min_value
        y_pos = ((value - self.min_value) / value_range) * self.height + self.y
        return y_pos

    def draw_data_point(self, x_pos, y_pos):
        """ Draw a single data point at the given x and y positions. """
        dot_size = 5  # Size of the dot
        Ellipse(pos=(x_pos - dot_size / 2, y_pos - dot_size / 2), size=(dot_size, dot_size))

    def draw_normal_line(self):
        """ Draw a line indicating the normal value. """
        normal_y = self.normalize_y(self.normal_value)
        Line(points=[self.histogram_container.x, normal_y, self.histogram_container.x + self.histogram_container.width, normal_y], dash_offset=5)

